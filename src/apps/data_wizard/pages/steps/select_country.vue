<template>
  <md-card class="card">

    <md-card-header>
      <div class="md-title">Select a country</div>
    </md-card-header>
    <md-card-content>

      <md-input-container>
        <label for="country">Country (sort order is reverse latitude)</label>
        <md-select name="country" id="country" v-model="country" @change="select_country">
          <md-option v-for="country in countries" :key="country.slug" :value="country.slug">{{country.name}}</md-option>
        </md-select>
      </md-input-container>

      <!--<div id="map"></div>-->

    </md-card-content>
  </md-card>

</template>

<script>
  import centroid from '@turf/centroid'
  import bbox from '@turf/bbox'
  import geoViewport from '@mapbox/geo-viewport'
  import {getCoord} from '@turf/invariant'

  import {basic_map} from 'lib/helpers/basic_map'

  export default {
    name: 'select_country',
    mounted() {
    },
    data() {
      return {
        countries: [],
        country: ''
      }
    },
    mounted() {
      this.prepare_countries_list()
    },
    methods: {
      create_map() {
//        this._map = basic_map(this.$store)
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
                name: c.properties.name,
                slug: c.properties.sov_a3,
                map_focus
              }
//            }).sort((a, b) => (a.name > b.name) - (a.name < b.name))
            }).sort((a,b) => {return a.map_focus.centre.lat - b.map_focus.centre.lat})
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
      },
    }
  }
</script>

<style scoped>

</style>
