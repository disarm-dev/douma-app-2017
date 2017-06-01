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
    props: ['edit'],
    data() {
      return {
        _map: null,
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        field_name: state => state.instance_config.spatial_hierarchy[0].field_name,
        denominator: state => state.instance_config.denominator,
        slug: state => state.instance_config.slug.toLowerCase(),
        selected_target_area_ids: state => state.irs_plan.selected_target_area_ids,
        cached_target_areas: state => {
          if (state.cache) {
            return state.cache.target_areas
          } else {
            return false
          }
        }
      }),
    },
    watch: {
      'cached_target_areas': () => console.log('watch', this.cached_target_areas),
      'selected_target_area_ids': 'render_clusters'
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

        if (!this.cached_target_areas) {
          this.fetch_target_areas_json().then(geojson => {
            this.$store.commit('root:set_cache', {key: 'target_areas', value: geojson})
            this.add_target_areas()
          })
        } else {
          this.add_target_areas()
        }
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
              console.log(this.selected_target_area_ids)
              this._map.setFilter('selected', ['in', this.field_name].concat(this.selected_target_area_ids))
              this._map.setFilter('unselected', ['!in', this.field_name].concat(this.selected_target_area_ids))
            }
          });
        }
      },
      fetch_target_areas_json() {
        return fetch(`/static/api_testing/${this.slug}/spatial_hierarchy/${this.slug}.${this.denominator.aggregate_to}.geojson`)
          .then(res => res.json())
      },
      add_target_areas() {
        const geojson = this.cached_target_areas

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
