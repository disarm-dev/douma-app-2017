<template>
  <div class="applet_container">
    <md-card class="card">

      <md-card-header>
        <div class="md-title">Select a country below</div>
      </md-card-header>
      <md-card-content>

        <md-input-container>
          <label for="country">Country</label>
          <md-select name="country" id="country" v-model="country">
            <md-option v-for="country in countries" :key="country.slug" :value="country.slug">{{country.name}}</md-option>
          </md-select>
        </md-input-container>

        <!--<div id="map"></div>-->

      </md-card-content>
      <md-card-actions>
        <md-button @click.native="select_country">
          Select country
        </md-button>
      </md-card-actions>
    </md-card>

    <md-card class="card" v-if="show_admin_levels">
      <md-card-header>
        <div class="md-title">Select admin levels to include</div>
      </md-card-header>
      <md-card-content>
        <md-list>
          <md-list-item>
            <span><b>Admin level</b></span>
            <div><b>Include</b></div>
            <div><b>Planning level</b></div>
          </md-list-item>
          <md-list-item>
            <span>Admin 1</span>
            <md-checkbox v-model="include_areas.one"></md-checkbox>

            <md-radio v-model="planning_level" md-value="one"></md-radio>
          </md-list-item>

          <md-list-item>
            <span>Admin 2</span>
            <md-checkbox v-model="include_areas.two"></md-checkbox>

            <md-radio v-model="planning_level" md-value="two"></md-radio>
          </md-list-item>

          <md-list-item>
            <span>Admin 3</span>
            <md-checkbox v-model="include_areas.three"></md-checkbox>

            <md-radio v-model="planning_level" md-value="three"></md-radio>
          </md-list-item>

          <md-list-item>
            <md-button class="md-raised md-primary">Add OSM data</md-button>
          </md-list-item>
          <md-list-item>
            <md-button class="md-raised md-primary">Add your own geo-spatial data</md-button>
          </md-list-item>
        </md-list>
      </md-card-content>
    </md-card>

    <md-card class="card" v-if="show_admin_levels">
      <md-card-header>
        <div class="md-title">Select risk and population layers</div>
      </md-card-header>
      <md-card-content>
        <md-list>
          <md-list-item>
            <span>Risk</span>
            <md-checkbox v-model="use_default_layers">import from Malaria Atlas Project</md-checkbox>
            <md-button class="md-raised md-primary">custom</md-button>
          </md-list-item>
          <md-list-item>
            <span>Population</span>
            <md-checkbox v-model="use_default_layers">import from Worldpop</md-checkbox>
            <md-button class="md-raised md-primary">custom</md-button>
          </md-list-item>
        </md-list>
      </md-card-content>

      <md-card-actions>
        <span>Hit 'start' to start geoprocessing</span>
        <md-button @click.native="select_spatial_hierarchy">Start processing</md-button>
      </md-card-actions>

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
    name: 'configure_geodata',
    data () {
      return {
        countries: [],
        show_admin_levels: false,
        show_raster_inputs: false,

        country: '',
        use_default_layers: true,
        planning_level: '',
        include_areas: {
          adm0: '',
          adm1: '',
          adm2: '',
        }
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

        this.show_admin_levels = true
      },
      select_spatial_hierarchy() {
        console.log('this.include_areas', this.include_areas)
        console.log('this.planning_level', this.planning_level)

        let final_areas = []
        for (let level_name in this.include_areas) {
          if (this.include_areas[level_name]) {
            final_areas.push(level_name)
          }
        }

        this.$store.commit('data_wizard/set_spatial_hierarchies', final_areas)
        this.$store.commit('data_wizard/set_planning_level', this.planning_level)

        // TODO: @feature Send of planning level
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
