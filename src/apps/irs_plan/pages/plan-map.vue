<template>
  <div>
    <md-checkbox :disabled='!data_ready || clusters_disabled' v-model="clusters_visible">Show clusters</md-checkbox>
    <div id="map"></div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import mapboxgl from 'mapbox-gl'
  import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw'
  mapboxgl.accessToken = 'pk.eyJ1Ijoibmljb2xhaWRhdmllcyIsImEiOiJjaXlhNWw1NnkwMDJoMndwMXlsaGo5NGJoIn0.T1wTBzV42MZ1O-2dy8SpOw'
  import bbox from '@turf/bbox'
  import intersect from '@turf/intersect'

  import cache from '@/lib/cache.js'

  export default {
    name: 'plan_map',
    props: ['edit_mode', 'data_ready'],
    data() {
      return {
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
        selected_target_area_ids: state => state.irs_plan.selected_target_area_ids,
      }),
    },
    watch: {
      'clusters_visible': 'toggle_cluster_visiblity',
      'edit_mode': 'manage_map_mode',
      'data_ready': 'populate_data_from_global',
      'selected_target_area_ids': 'redraw_target_areas'
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
          const feature = this._map.queryRenderedFeatures(e.point, {layers: ['selected', 'unselected']})[0]

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
          id: 'selected',
          type: 'fill',
          source: 'target_areas_source',
          paint: {
            'fill-color': '#a6dba0',
            'fill-opacity': 0.8,
            'fill-outline-color': 'black'
          },
          filter: ['in', this.field_name].concat(this.selected_target_area_ids)
        }, 'clusters')

        this._map.addLayer({
          id: 'unselected',
          type: 'fill',
          source: 'target_areas_source',
          paint: {
            'fill-color': '#c2a5cf',
            'fill-opacity': 0.8,
            'fill-outline-color': 'black'
          },
          filter: ['!in', this.field_name].concat(this.selected_target_area_ids)
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
      },
      redraw_target_areas() {
        if (this.data_ready) {
          this.remove_target_areas()
          this.add_target_areas()
        }
      },
      refilter_target_areas() {
        this._map.setFilter('selected', ['in', this.field_name].concat(this.selected_target_area_ids))
        this._map.setFilter('unselected', ['!in', this.field_name].concat(this.selected_target_area_ids))
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

          // figure out which ones are included in current `selected_target_area_ids`
          // show them
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
