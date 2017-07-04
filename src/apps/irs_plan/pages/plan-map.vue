<template>
  <div>
    <div v-if="edit_mode">
    <p>Showing areas where risk is above: {{converted_slider_value}}</p>
    <input  id="slider" type="range" ref='risk_slider' :min="slider.min" :max="slider.max" step="slider.step" v-model="risk_slider_value">
    </div>
    <md-checkbox :disabled='!geodata_ready || clusters_disabled' v-model="clusters_visible">Show clusters</md-checkbox>
    <div id="map"></div>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import mapboxgl from 'mapbox-gl'
  import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw'
  mapboxgl.accessToken = 'pk.eyJ1Ijoibmljb2xhaWRhdmllcyIsImEiOiJjaXlhNWw1NnkwMDJoMndwMXlsaGo5NGJoIn0.T1wTBzV42MZ1O-2dy8SpOw'
  import bbox from '@turf/bbox'
  import centroid from '@turf/centroid'
  import within from '@turf/within'
  import inside from '@turf/inside'
  import intersect from '@turf/intersect'
  import bboxPolygon from '@turf/bbox-polygon'
  import {featureCollection} from '@turf/helpers'
  import {getCoord} from '@turf/invariant'
  import which_polygon from 'which-polygon'
  import debounce from 'lodash.debounce'
  import chroma from 'chroma-js'

  import cache from 'config/cache.js'
  import logslider from 'lib/log_slider.js'
  import logscale from 'lib/log_scale.js'
  import {basic_map} from 'lib/basic_map'
  import {get_planning_level_id_field, get_planning_level_name} from 'lib/spatial_hierarchy_helper'

  export default {
    name: 'plan_map',
    props: ['edit_mode', 'geodata_ready', 'risk_visible'],
    data() {
      return {
        slider: {
          min: 0,
          max: 100,
          step: 1
        },
        risk_slider_value: 0,
        logslider: null,

        clusters_disabled: true, // Before map_loaded
        clusters_visible: false,
        user_map_focus: false,
        draw: null,
        _map: null,
        map_loaded: false,

        handler: {
          click: null,
          move: null
        }
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        areas_included_by_click: state => state.irs_plan.areas_included_by_click,
        areas_excluded_by_click: state => state.irs_plan.areas_excluded_by_click,
        bulk_selected_ids: state => state.irs_plan.bulk_selected_ids,
      }),
      ...mapGetters({
        selected_target_area_ids: 'irs_plan/all_selected_area_ids'
      }),
      planning_level_name() {
        return get_planning_level_name(this.instance_config)
      },
      planning_level_id_field() {
        return get_planning_level_id_field(this.instance_config)
      },
      converted_slider_value() {
        if (!this.logslider) return 0

        let converted_value
        if (parseFloat(this.risk_slider_value) === this.slider.min) {
          converted_value = 0
        } else {
          converted_value = this.logslider(this.risk_slider_value)
        }
        return converted_value
      }
    },
    watch: {
      'clusters_visible': 'toggle_cluster_visiblity',
      'edit_mode': 'manage_map_mode',
      'geodata_ready': 'render_map',
      'selected_target_area_ids': 'redraw_target_areas',
      'risk_slider_value': 'set_risk_slider_value',
      'risk_visible': 'toggle_show_areas_by_risk'
    },
    mounted() {
      this.render_map()
    },
    methods: {
      // Get some data in
      render_map() {
        if (this.geodata_ready) {
          this._map = basic_map(this.$store)

          this._map.on('load', () => {
            this.clusters_disabled = false
            this.manage_map_mode()
            this.add_target_areas()
            this.$emit('map_loaded')
            this.set_slider_range()
            console.warn("remove debug which_poly_is_this_point_in")
            this.which_poly_is_this_point_in()
          })
        }
      },

      fit_bounds(geojson) {
        if (!this.user_map_focus) {
          const bounds = bbox(geojson)
          this._map.fitBounds(bounds, {padding: 20})
          this.user_map_focus = true
        }
      },
      remove_map_listeners() {
        if (this._map) {
          if (this._map.listens('click') && this.handler.click) this._map.off('click', this.handler.click)
          if (this._map.listens('mousemove') && this.handler.move) this._map.off('mousemove', this.handler.move)
        }
      },
      add_map_listeners() {
        this.remove_map_listeners()
        this.handler.click = (e) => {
          const feature = this._map.queryRenderedFeatures(e.point, {layers: ['selected', 'unselected', 'bulk_selected', 'bulk_unselected']})[0]

          if (feature) {
            const feature_id = feature.properties[this.planning_level_id_field]
            this.$store.commit('irs_plan/toggle_selected_target_area_id', feature_id)
            this.refilter_target_areas()
          }
        }

        this.handler.move = (e) => {
          const features = this._map.queryRenderedFeatures(e.point, {layers: ['selected', 'unselected']})
          this._map.getCanvas().style.cursor = features.length ? 'pointer' : ''
        }

        // Add cursor/pointer handler
        this._map.on('mousemove', this.handler.move)

        // Add click handler
        this._map.on('click', this.handler.click);
      },
      manage_map_mode() {
        // Check if you're in editing mode
        if(this.edit_mode) {
          this.add_map_listeners()
          this.add_draw_controls()
        } else {
          this.remove_map_listeners()
          this.remove_draw_controls()
        }
      },

      // Add and handle target_areas
      add_target_areas() {
        const geojson = cache.geodata[this.planning_level_name]

        if(!this._map.getSource('target_areas_source')) {
          this._map.addSource('target_areas_source', {
            'type': 'geojson',
            'data': geojson
          })
        }

        this._map.addLayer({
          id: 'bulk_selected',
          type: 'fill',
          source: 'target_areas_source',
          paint: {
            'fill-color': '#df8ad9',
            'fill-opacity': 0.7,
            'fill-outline-color': 'black'
          },
          filter: ['in', this.planning_level_id_field].concat(this.bulk_selected_ids)
        }, 'clusters')

        this._map.addLayer({
          id: 'bulk_unselected',
          type: 'fill',
          source: 'target_areas_source',
          paint: {
            'fill-color': '#fff',
            'fill-opacity': 0.5,
            'fill-outline-color': 'black'
          },
          filter: ['!in', this.planning_level_id_field].concat(this.bulk_selected_ids)
        }, 'clusters')

        this._map.addLayer({
          id: 'selected',
          type: 'fill',
          source: 'target_areas_source',
          paint: {
            'fill-color': '#de27da',
            'fill-opacity': 0.7,
            'fill-outline-color': 'black'
          },
          filter: ['in', this.planning_level_id_field].concat(this.areas_included_by_click)
        }, 'clusters')

        this._map.addLayer({
          id: 'unselected',
          type: 'fill',
          source: 'target_areas_source',
          paint: {
            'fill-color': '#a6a6a6',
            'fill-opacity': 0.7,
            'fill-outline-color': 'black'
          },
          filter: ['in', this.planning_level_id_field].concat(this.areas_excluded_by_click)
        }, 'clusters')

        this.fit_bounds(geojson)
      },
      remove_target_areas() {
        if (this._map.getLayer('selected'))
          this._map.removeLayer('selected')
        if (this._map.getLayer('unselected'))
          this._map.removeLayer('unselected')
        if (this._map.getLayer('bulk_selected'))
          this._map.removeLayer('bulk_selected')
        if (this._map.getLayer('bulk_unselected'))
          this._map.removeLayer('bulk_unselected')
      },
      redraw_target_areas() {
        if (this.geodata_ready && this._map.loaded()) {
          // redraw target areas
          this.remove_target_areas()
          this.add_target_areas()

          // remove + add draw_controls
          this.remove_draw_controls()
          this.add_draw_controls()
        }
      },
      refilter_target_areas() {
        this._map.setFilter('bulk_selected', ['in', this.planning_level_id_field].concat(this.bulk_selected_ids))
        this._map.setFilter('bulk_unselected', ['!in', this.planning_level_id_field].concat(this.bulk_selected_ids))
        this._map.setFilter('selected', ['in', this.planning_level_id_field].concat(this.areas_included_by_click))
        this._map.setFilter('unselected', ['in', this.planning_level_id_field].concat(this.areas_excluded_by_click))
      },

      // Clusters
      toggle_cluster_visiblity() {

        if(!this._map.getSource('clusters_source')) {
          this._map.addSource('clusters_source', {
            type: 'geojson',
            data: cache.clusters
          })
        }

        if (this.clusters_visible) {
          const colour = '#ff8a21'

          this._map.addLayer({
            id: 'clusters',
            type: 'fill',
            source: 'clusters_source',
            paint: {
              'fill-color': colour,
              'fill-opacity': 0.9,
              'fill-outline-color': colour
            },
          })
          this.$ga.event('irs_plan','change_clusters_visibility','visible', true)

        } else {
          this._map.removeLayer('clusters')
          this.$ga.event('irs_plan','change_clusters_visibility','visible', false)
        }
      },

      // Draw controls
      add_draw_controls () {
        if (this._map) {
          const options = {
            boxSelect: false,
            keyBindings: false,
            displayControlsDefault: false,
            controls: {
              polygon: true
            }
          }
          this.draw = new MapboxDraw(options)

          this._map.on('draw.create', (e) => {
            this.finish_drawing(e.features)
          })

          this._map.on('draw.modechange', (e) => {
            if(e.mode === 'draw_polygon') this.remove_map_listeners()
          })

          this._map.addControl(this.draw)
        }
      },
      remove_draw_controls () {
        if (this.draw) {
          this._map.removeControl(this.draw)
          this.draw = null
        }
      },
      find_selected_polygons(polygon_drawn) {

        const all_polygons = cache.geodata[this.planning_level_name]

        // calculate centroids for all polygons
        const all_centroids = all_polygons.features.map((feature => {
          const c = centroid(feature)
          c.properties = feature.properties
          return c
        }))

        // Create a Bbox from polygon_drawn
        const bounding_box = bbox(polygon_drawn)

        // bounding_box_centroids =  Find all centroids in bbox
        const bounding_box_centroids = within(featureCollection(all_centroids), featureCollection([bboxPolygon(bounding_box)]))

        // find centroids in polygon_drawn
        const centroids_in_polygon_drawn = within(bounding_box_centroids, featureCollection([polygon_drawn]))

        // return ids of centroids in polygon_drawn
        return centroids_in_polygon_drawn
      },
      finish_drawing(features) {
        let polygon_drawn = features[0]

        // 1. Approach using centroids
        // doesn't capture as many polygons though
        const polygons_within_polygon_drawn = this.find_selected_polygons(polygon_drawn)
        const selected_areas = polygons_within_polygon_drawn.features.map(f => f.properties[this.planning_level_id_field])

        // 2. Approach using intersection
        // let polygons = cache.geodata[this.planning_level_name].features
        // let selected_areas = []
        // polygons.forEach((polygon) => {
        //   if (intersect(polygon_drawn, polygon)) {
        //       const feature_id = polygon.properties[this.planning_level_id_field]
        //       selected_areas.push(feature_id)
        //   }
        // })

        this.$store.commit('irs_plan/add_selected_target_areas', selected_areas)

        this.draw.deleteAll()

        this.add_map_listeners() // Restore original click-handler
        this.refilter_target_areas()
      },

      // Risk slider
      set_risk_slider_value: debounce(function(){

        let areas = cache.geodata[this.planning_level_name].features.filter((feature) => {
          return feature.properties.risk >= this.converted_slider_value
        })

        let area_ids = areas.map((area) => {
          return area.properties[this.planning_level_id_field]
        })

        this.$store.commit('irs_plan/set_bulk_selected_ids', area_ids)
        this.refilter_target_areas()
        this.$ga.event('irs_plan','change_risk_slider')
      }, 750),
      set_slider_range() {
        const values_array = cache.geodata[this.planning_level_name].features.map(area => area.properties.risk).sort()
        const non_zeros = values_array.filter(v => v !== 0)

        const mino = Math.min(...non_zeros)
        const maxo = Math.max(...values_array) * 1.001
        this.logslider = logslider(this.slider.min, this.slider.max, mino, maxo)
      },

      // RISK
      toggle_show_areas_by_risk() {
        if (this.risk_visible) {
          this.add_areas_coloured_by_risk()
        } else {
          this._map.removeLayer('areas_by_risk')
          this._map.removeSource('areas_by_risk')
        }
      },
      add_areas_coloured_by_risk() {

        this.get_log_values(cache.geodata[this.planning_level_name])

        const features = cache.geodata[this.planning_level_name].features.map((feature) => {
          if (feature.properties.risk === 0) {
            feature.properties.normalised_risk = 0
          } else {
            feature.properties.normalised_risk = this.log_scale(feature.properties.risk)
          }
          return feature
        })

        const areas_with_normalised_risk = featureCollection(features)

        // create stops
        const scale = chroma.scale("RdYlBu").colors(11).reverse()
        const steps = [...Array(11).keys()].map(i => i * 10)
        const stops = steps.map((step, index) => {
          return [step, scale[index]]
        })

        this._map.addLayer({
          id: 'areas_by_risk',
          type: 'fill',
          source: {
            type: 'geojson',
            data: areas_with_normalised_risk
          },
          paint: {
            'fill-color': {
              property: 'normalised_risk',
              // TODO: @feature Use a different palette
              stops: stops
            },
            'fill-opacity': 0.9,
            'fill-outline-color': 'black'
          }
        }, 'records')

        this._map.fitBounds(bbox(areas_with_normalised_risk), {padding: 20});
      },
      get_log_values(areas) {
        const values_array = areas.features.map(area => area.properties.risk).sort()
        const non_zeros = values_array.filter(v => v !== 0)

        const mino = Math.min(...non_zeros)
        const maxo = Math.max(...values_array) * 1.001

        this.log_scale = logscale(mino, maxo)

        if (this.log_scale(mino) !== 0) console.log('min should be 0', this.log_scale(mino))
        if (this.log_scale(maxo) !== 100) console.log('max should be 100', this.log_scale(maxo))
      },
      which_poly_is_this_point_in() {
        // const level = this.planning_level_name
        const level = 'clusters'

        console.time('centroids')
        let centroids = cache.geodata[level].features.map(feature => {
          return getCoord(centroid(feature))
        })
        centroids = centroids.concat(centroids.slice(), centroids.slice(), centroids.slice(), centroids.slice())
//        centroids = centroids.concat(centroids.slice(), centroids.slice(), centroids.slice(), centroids.slice())
//        centroids = centroids.concat(centroids.slice(), centroids.slice(), centroids.slice(), centroids.slice())
        centroids = centroids.sort((a, b) => Math.random() > 0.5)
//        centroids = centroids.reverse()
        console.timeEnd('centroids')

        console.time('index')
        const polys = cache.geodata[level].features
        const query = which_polygon(featureCollection(polys))
        console.timeEnd('index')

        window.c = centroids
        window.p = polys
        window.q = query

        let results = []
        console.time('which_poly_is_this_point_in OBJECT')
        centroids.forEach(c => {
          const result = query(c)
//          c.location_id = result.id
          results.push([c, result.id])
//          results.push(result)
        })
        console.timeEnd('which_poly_is_this_point_in OBJECT')

        results = []
        console.time('which_poly_is_this_point_in PROPERTIES')
        centroids.forEach(c => {
          const result = query(c)
//          results.push({point: c, poly: result})
          results.push(result)
        })
        console.timeEnd('which_poly_is_this_point_in PROPERTIES')
        console.log('results', results)
      }
    }
  }
</script>

<style>
  #map {
    height: 500px;
    z-index: 0;
  }
</style>
