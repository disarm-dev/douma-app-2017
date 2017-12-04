<template>
  <div>
    <div>
      <md-button @click="get_configuration">Get configuration</md-button>
      <md-button @click="get_data">Get data</md-button>
      <md-button @click="rerun_pipelines">Rerun pipelines</md-button>
    </div>

    <div v-for="component_configuration in configuration.components">
      <component_renderer :config="component_configuration"></component_renderer>
    </div>

  </div>
</template>

<script>
  // Should be in `src/config/configure_application.js`, here for ease-of-reference
  import Vue from 'vue'
  import UnityPlugin from './unity-integration'
  Vue.use(UnityPlugin)

  // Nasty bootstrap to get unity + DOUMA playing nice to start
  import {load_data} from './bootstrap'

  // Applet-specific
  import component_renderer from "./component_renderer.vue"

  export default {
    components: {component_renderer},
    name: 'unity-dashboard',
    mixins: [UnityMixin],
    props: {
      dashboard_id: String,
    },
    methods: {
      rerun_pipelines() {
        this.$unity.rerun_pipelines()
      }
    }
  }
</script>

<style scoped>

</style>