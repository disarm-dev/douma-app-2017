<template>
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
        <md-button @click.native="start_processing">Start processing</md-button>
      </md-card-actions>

    </md-card>
</template>

<script>
export default {

  name: 'select_data_source_layers',

  data () {
    return {
      use_default_layers: true
    };
  },
  methods: {
    start_processing() {
      console.log('start_processing')
    }
  }
};
</script>

<style lang="css" scoped>
</style>