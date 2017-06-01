<template>
  <div>
    <md-button>Toggle show clusters</md-button>
    <div id="map"></div>
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl'
  mapboxgl.accessToken = 'pk.eyJ1Ijoibmljb2xhaWRhdmllcyIsImEiOiJjaXlhNWw1NnkwMDJoMndwMXlsaGo5NGJoIn0.T1wTBzV42MZ1O-2dy8SpOw'

  export default {
    name: 'plan_map',
    props: ['edit'],
    data() {
      return {
        _map: null,
        _all_target_areas: []
      }
    },
    computed: {
      instance_config() {
        return this.$store.state.instance_config
      },
      field_name() {
        return this.$store.state.instance_config.spatial_hierarchy[0].field_name
      },
      denominator() {
        return this.$store.state.instance_config.denominator
      },
      slug() {
        return this.$store.state.instance_config.slug.toLowerCase()
      },
      selected_target_area_ids() {
        return this.$store.state.irs_plan.selected_target_area_ids
      }
    },
    watch: {
      'selected_target_area_ids': 'render_clusters'
    },
    mounted() {
      if (this.edit) {
        console.log('can edit')
      } else {
        console.log('cannot edit')
      }

      this.create_map()
      this.add_map_click_handler()
      this.fetch_target_areas_json()

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
        this._map.on('load', () => {
          fetch(`/static/api_testing/${this.slug}/spatial_hierarchy/${this.slug}.${this.denominator.aggregate_to}.geojson`)
            .then(res => res.json())
            .then(geojson => {
              this._all_target_areas = geojson
              this.add_target_areas()
            })
        })
      },
      add_target_areas() {
        const geojson = this._all_target_areas

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
