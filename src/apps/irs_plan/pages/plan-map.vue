<template>
  <div>
    <md-button>Toggle show clusters</md-button>
    <div id="map"></div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import mapboxgl from 'mapbox-gl'
  mapboxgl.accessToken = 'pk.eyJ1Ijoibmljb2xhaWRhdmllcyIsImEiOiJjaXlhNWw1NnkwMDJoMndwMXlsaGo5NGJoIn0.T1wTBzV42MZ1O-2dy8SpOw'

  export default {
    name: 'plan_map',
    props: ['edit', 'all_target_areas'],
    data() {
      return {
        _map: null
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
      'selected_target_area_ids': 'render_clusters',
      'all_target_areas': 'add_target_areas'
    },
    mounted() {
      if (this.edit) {
        console.log('can edit')
      } else {
        console.log('cannot edit')
      }

      this.create_map()
      this._map.on('load', () => {
        this.add_map_click_handler()
      })
    },
    methods: {
      create_map() {
        this._map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [this.instance_config.map_focus.centre.lng, this.instance_config.map_focus.centre.lat],
          zoom: this.instance_config.map_focus.zoom
        });

      },
      add_map_click_handler() {
        if (this.edit) {
          this._map.on('click', (e) => {
            const feature = this._map.queryRenderedFeatures(e.point, {layers: ['selected', 'unselected']})[0]
            console.log('feature',  feature)

            if (feature) {
              const feature_id = feature.properties[this.field_name]
              this.$store.commit('irs_plan/toggle_selected_target_area', feature_id)
              this._map.setFilter('selected', ['in', this.field_name].concat(this.selected_target_area_ids))
              this._map.setFilter('unselected', ['!in', this.field_name].concat(this.selected_target_area_ids))
            }
          });
        }
      },
      add_target_areas() {
        this._map.on('load', () => {
          const geojson = this.all_target_areas

          this._map.addLayer({
            id: 'selected',
            type: 'fill',
            source: {
              type: 'geojson',
              data: geojson
            },
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
            source: {
              type: 'geojson',
              data: geojson
            },
            paint: {
              'fill-color': '#c2a5cf',
              'fill-opacity': 0.8,
              'fill-outline-color': 'black'
            },
            filter: ['!in', this.field_name].concat(this.selected_target_area_ids)
          })

        })
      },
      render_clusters() {
        if (this.clusters_visible) {
//          figure out which ones are included in current `selected_target_area_ids`
//          show them
        } else {
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
