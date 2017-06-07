<template>
  <div>
    <div v-if="edit_mode">
    <p>Showing localities where risk is above: {{converted_slider_value}}</p>
    <input  id="slider" type="range" ref='risk_slider' :min="slider.min" :max="slider.max" step="slider.step" v-model="risk_slider_value">
    </div>
    <md-checkbox :disabled='!data_ready || clusters_disabled' v-model="clusters_visible">Show clusters</md-checkbox>
    <div id="map"></div>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import mapboxgl from 'mapbox-gl'
  import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw'
  mapboxgl.accessToken = 'pk.eyJ1Ijoibmljb2xhaWRhdmllcyIsImEiOiJjaXlhNWw1NnkwMDJoMndwMXlsaGo5NGJoIn0.T1wTBzV42MZ1O-2dy8SpOw'
  import bbox from '@turf/bbox'
  import intersect from '@turf/intersect'
  import numeral from 'numeral'
  import debounce from 'lodash.debounce'

  import cache from '@/lib/cache.js'
  import logslider from '@/lib/log_slider.js'

  export default {
    name: 'plan_map',
    props: ['edit_mode', 'data_ready'],
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
        _geodata: {
          all_target_areas: null,
          clusters: null
        },
        handler: {
          click: null,
          move: null
        }
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        field_name: state => state.instance_config.spatial_hierarchy[0].field_name,
        denominator: state => state.instance_config.denominator,
        slug: state => state.instance_config.slug,
        areas_included_by_click: state => state.irs_plan.areas_included_by_click,
        areas_excluded_by_click: state => state.irs_plan.areas_excluded_by_click,
        bulk_selected_ids: state => state.irs_plan.bulk_selected_ids,
      }),
      ...mapGetters({
        selected_target_area_ids: 'irs_plan/all_selected_area_ids'
      }),
      converted_slider_value() {
        if (!this.logslider) return 0

        let converted_value
        if (parseFloat(this.risk_slider_value) === this.slider.min) {
          converted_value = 0
        } else {1
          converted_value = this.logslider(this.risk_slider_value)
        }
        return converted_value
        // return numeral(converted_value).format('0.00') // values for ZWE are too small to view this way
      }
    },
    watch: {
      'clusters_visible': 'toggle_cluster_visiblity',
      'edit_mode': 'manage_map_mode',
      'data_ready': 'populate_data_from_global',
      'selected_target_area_ids': 'redraw_target_areas',
      'risk_slider_value': 'set_risk_slider_value'
    },
    methods: {
      populate_data_from_global() {
        this._geodata = cache.geodata

        this._map = this.create_map()


        this._map.on('load', () => {
          this.clusters_disabled = false
          this.manage_map_mode()
          this.add_target_areas()
          this.$emit('map_loaded')
          this.set_slider_range()
        })
      },
      create_map() {
        return new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [23.31117652857256, -25.74823900711678],
          zoom: 3.9642688564
        });
      },
      remove_map_listeners() {
        if (this._map.listens('click') && this.handler.click) this._map.off('click', this.handler.click)
        if (this._map.listens('mousemove') && this.handler.move) this._map.off('mousemove', this.handler.move)
      },
      add_map_listeners() {
        this.remove_map_listeners()
        this.handler.click = (e) => {
          const feature = this._map.queryRenderedFeatures(e.point, {layers: ['selected', 'unselected', 'bulk_selected', 'bulk_unselected']})[0]

          if (feature) {
            const feature_id = feature.properties[this.field_name]
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
        if(!this.edit_mode && this._map && this._map.loaded()) {

          // Remove any existing click handler
          this.remove_map_listeners()

          this.remove_draw_controls()

        } else {
          // Keep hold of click handler
          this.add_map_listeners()

          this.add_draw_controls()
        }
      },
      add_target_areas() {
        const geojson = this._geodata.all_target_areas

        if(!this._map.getSource('target_areas_source')) {
          this._map.addSource('target_areas_source', {
            'type': 'geojson',
            'data': this._geodata.all_target_areas
          })
        }

        this._map.addLayer({
          id: 'bulk_selected',
          type: 'fill',
          source: 'target_areas_source',
          paint: {
            'fill-color': '#a6dba0',
            'fill-opacity': 1,
            'fill-outline-color': 'black'
          },
          filter: ['in', this.field_name].concat(this.bulk_selected_ids)
        }, 'clusters')

        this._map.addLayer({
          id: 'bulk_unselected',
          type: 'fill',
          source: 'target_areas_source',
          paint: {
            'fill-color': '#c2a5cf',
            'fill-opacity': 1,
            'fill-outline-color': 'black'
          },
          filter: ['!in', this.field_name].concat(this.bulk_selected_ids)
        }, 'clusters')

        this._map.addLayer({
          id: 'selected',
          type: 'fill',
          source: 'target_areas_source',
          paint: {
            'fill-color': '#008837',
            'fill-opacity': 1,
            'fill-outline-color': 'black'
          },
          filter: ['in', this.field_name].concat(this.areas_included_by_click)
        }, 'clusters')

        this._map.addLayer({
          id: 'unselected',
          type: 'fill',
          source: 'target_areas_source',
          paint: {
            'fill-color': '#7b3294',
            'fill-opacity': 1,
            'fill-outline-color': 'black'
          },
          filter: ['in', this.field_name].concat(this.areas_excluded_by_click)
        }, 'clusters')

        this.fit_bounds(geojson)
      },
      add_draw_controls () {
        this.remove_draw_controls()

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
      },
      remove_draw_controls () {
        if (this.draw) this._map.removeControl(this.draw)
        this.draw = null
      },
      fit_bounds(geojson) {
        if (!this.user_map_focus) {
          const bounds = bbox(geojson)
          this._map.fitBounds(bounds, {padding: 20})
          this.user_map_focus = true
        }
      },
      remove_target_areas() {
        this._map.removeLayer('selected')
        this._map.removeLayer('unselected')
        this._map.removeLayer('bulk_selected')
        this._map.removeLayer('bulk_unselected')
      },
      redraw_target_areas() {
        if (this.data_ready) {
          this.remove_target_areas()
          this.add_target_areas()
        }
      },
      refilter_target_areas() {

        this._map.setFilter('bulk_selected', ['in', this.field_name].concat(this.bulk_selected_ids))
        this._map.setFilter('bulk_unselected', ['!in', this.field_name].concat(this.bulk_selected_ids))
        this._map.setFilter('selected', ['in', this.field_name].concat(this.areas_included_by_click))
        this._map.setFilter('unselected', ['in', this.field_name].concat(this.areas_excluded_by_click))
      },
      toggle_cluster_visiblity() {

        if(!this._map.getSource('clusters_source')) {
          this._map.addSource('clusters_source', {
            type: 'geojson',
            data: this._geodata.clusters
          })
        }

        if (this.clusters_visible) {

          this._map.addLayer({
            id: 'clusters',
            type: 'line',
            source: 'clusters_source',
            paint: {
              'line-color': 'yellow'
            },
          })

        } else {
          this._map.removeLayer('clusters')
        }
      },
      finish_drawing(features) {
        let drawn_polygon = features[0]

        let polygons = this._geodata.all_target_areas.features
        let selected_areas = []
        polygons.forEach((polygon) => {
          if (intersect(drawn_polygon, polygon)) {
              const feature_id = polygon.properties[this.field_name]
              selected_areas.push(feature_id)
          }
        })
        this.$store.commit('irs_plan/add_selected_target_areas', selected_areas)

        this.draw.deleteAll()
        this.add_map_listeners() // Restore click-handler
        this.refilter_target_areas()
      },
      set_risk_slider_value: debounce(function(){ 

        let areas = this._geodata.all_target_areas.features.filter((feature) => {
          return feature.properties.risk >= this.converted_slider_value
        })

        let area_ids = areas.map((area) => {
          return area.properties[this.field_name]
        })

        this.$store.commit('irs_plan/set_bulk_selected_ids', area_ids)
        this.refilter_target_areas()
        
      }, 750),
      set_slider_range() {
        const values_array = this._geodata.all_target_areas.features.map(area => area.properties.risk).sort()
        const non_zeros = values_array.filter(v => v !== 0)

        const mino = Math.min(...non_zeros)
        const maxo = Math.max(...values_array) * 1.001
        this.logslider = logslider(this.slider.min, this.slider.max, mino, maxo)
      },
    }
  }
</script>

<style>
  #map {
    height: 500px;
    z-index: 0;
  }
</style>
