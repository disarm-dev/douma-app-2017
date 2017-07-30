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
      <md-card-actions>
        <span>Hit 'start' to start geoprocessing</span>
        <md-button @click.native="select_spatial_hierarchy">Start processing</md-button>
      </md-card-actions>
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

      </md-card-actions>

    </md-card>


  </div>
</template>

<script>
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
        one: '',
        two: '',
        three: '',
      }
    }
  },
  mounted() {
    fetch('/static/countries.geojson')
      .then(res => res.json())
      .then((countries) => {

        this.countries = countries.features.filter(c => {
          return c.properties.region_un === 'Africa'
        }).map((c) => {
          return {
            name: c.properties.name,
            slug: c.properties.sov_a3
          }
        }).sort((a, b) => {
          return a.name < b.name
        })
      })
  },
  methods: {
    select_country() {
      console.log('selected country: ', this.country)
      this.$store.commit('data_wizard/set_country', this.country)
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
      this.$router.push({name: 'data_wizard:create_form'})
    }
  }
};
</script>

<style lang="css" scoped>
  .card {
    margin: 1em auto;
  }
</style>
