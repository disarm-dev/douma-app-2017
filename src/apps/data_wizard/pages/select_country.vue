<template>
  <div class="applet_container">
    <md-card class="card">

      <md-card-header>
        <div class="md-title">Select a country below</div>
      </md-card-header>
      <md-card-content>

        <md-input-container>
          <label for="country">Country</label>
          <md-select name="country" id="country" v-model="country" @change="select_country">
            <md-option v-for="country in countries" :key="country.slug" :value="country.slug">{{country.name}}</md-option>
          </md-select>
        </md-input-container>

        <div id="map"></div>

      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import centroid from '@turf/centroid'
  import bbox from '@turf/bbox'
  import geoViewport from '@mapbox/geo-viewport'
  import {getCoord} from '@turf/invariant'

  import {basic_map} from 'lib/helpers/basic_map'

  export default {
    name: 'select_country',
    data () {
      return {
        countries: [],
        show_admin_levels: false,
        show_raster_inputs: false,

        country: '',
        
      }
    },
    mounted() {
      this.prepare_countries_list()
    },
    methods: {
      create_map() {
        this._map = basic_map(this.$store)
      },
      prepare_countries_list() {
        fetch('/static/countries.geojson')
          .then(res => res.json())
          .then((countries) => {

            this.countries = countries.features.filter(c => {
              return c.properties.region_un === 'Africa'
            }).map((c) => {
              const c_viewport = geoViewport.viewport(bbox(c), [640, 480])
              const map_focus = {
                centre: {
                  lat: c_viewport.center[1],
                    lng: c_viewport.center[0]
                },
                zoom: c_viewport.zoom
              }

              return {
                feature: c,
                name: c.properties.name,
                slug: c.properties.sov_a3,
                map_focus
              }
            }).sort((a, b) => (a.name > b.name) - (a.name < b.name))
          })
          this.create_map()
      },
      select_country() {
        const country = this.countries.find((c) => c.slug === this.country)

        this.$store.commit('data_wizard/set_instance', {
          title: country.name,
          location_name: country.name,
          slug: country.slug
        })

        this.$store.commit('data_wizard/set_map_focus', country.map_focus)

        if (this._map.getLayer('country')) {
          this._map.removeLayer('country')
          this._map.removeSource('country')
        }

        this._map.addLayer({
          id: 'country',
          type: 'fill',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [country.feature]
            }
          },
          paint: {
            'fill-color': 'green',
            'fill-opacity': 0.9,
            'fill-outline-color': 'black'
          }
        })

        // TODO: @feature ZOOM to feature here
      }
      
    }
  };
</script>

<style scoped>
  #map {
    height: calc(80vh - 200px);
  }

  .card {
    margin: 1em auto;
  }
</style>
