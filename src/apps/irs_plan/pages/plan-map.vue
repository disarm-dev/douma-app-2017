<template>
  <div>
    <md-checkbox :disabled='!data_ready' v-model="show_clusters">Show clusters</md-checkbox>
    <div id="map"></div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import mapboxgl from 'mapbox-gl'
  mapboxgl.accessToken = 'pk.eyJ1Ijoibmljb2xhaWRhdmllcyIsImEiOiJjaXlhNWw1NnkwMDJoMndwMXlsaGo5NGJoIn0.T1wTBzV42MZ1O-2dy8SpOw'

  export default {
    name: 'plan_map',
    props: ['edit', 'data_ready'],
    data() {
      return {
        show_clusters: false,
        _map: null,
        _geodata: {
          all_target_areas: null,
          clusters: null
        }
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        field_name: state => state.instance_config.spatial_hierarchy[0].field_name,
        denominator: state => state.instance_config.denominator,
        slug: state => state.instance_config.slug.toLowerCase(),
        selected_target_area_ids: state => state.irs_plan.selected_target_area_ids,
      }),
    },
    watch: {
      'show_clusters': 'toggle_clusters',
      'edit': 'toggle_map_click',
      'data_ready': 'populate_data_from_global',
      'selected_target_area_ids': 'redraw_target_areas'
    },
    methods: {
      populate_data_from_global() {
        this._geodata = DOUMA_CACHE.geodata

        this._map = this.create_map()

        this._map.on('load', () => {
          this.toggle_map_click()
          this.add_target_areas()
        })
      },
      create_map() {
        return new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [this.instance_config.map_focus.centre.lng, this.instance_config.map_focus.centre.lat],
          zoom: this.instance_config.map_focus.zoom
        });

      },
      toggle_map_click() {
        if(!this.edit) {
          if (this._map.listens('click')) this._map.off('click', this.handler)
        } else {
          this.handler = (e) => {
            const feature = this._map.queryRenderedFeatures(e.point, {layers: ['selected', 'unselected']})[0]

            if (feature) {
              const feature_id = feature.properties[this.field_name]
              this.$store.commit('irs_plan/toggle_selected_target_area', feature_id)
              this._map.setFilter('selected', ['in', this.field_name].concat(this.selected_target_area_ids))
              this._map.setFilter('unselected', ['!in', this.field_name].concat(this.selected_target_area_ids))
            }
          }
          this._map.on('click', this.handler);

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
        })

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
        })

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
      toggle_clusters() {

        if(!this._map.getSource('clusters_source')) {
          this._map.addSource('clusters_source', {
            'type': 'geojson',
            'data': this._geodata.clusters
          })
        }

        if (this.show_clusters) {

          this._map.addLayer({
            'id': 'clusters',
            'type': 'line',
            source: 'clusters_source',
            'paint': {
              'line-color': 'blue'
            },
          })

//          figure out which ones are included in current `selected_target_area_ids`
//          show them
        } else {
          this._map.removeLayer('clusters')
//          hide clusters layer
//          what are you doing here?
        }
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
