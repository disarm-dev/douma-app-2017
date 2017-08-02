<template>
  <div class="applet_container">

    <md-card class="card">
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

    <md-card class="card">
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
  export default {
    name: 'configure_geodata',
    data () {
      return {
        show_admin_levels: false,
        show_raster_inputs: false,

        use_default_layers: true,
        planning_level: '',
        include_areas: {
          adm0: '',
          adm1: '',
          adm2: '',
        }
      }
    },
    methods: {

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
