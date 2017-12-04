<template>
  <div>
    <div>
      <md-button @click="get_data">Get data</md-button>

      <md-button @click="rerun_pipelines">Rerun pipelines</md-button>
    </div>


    <div v-for="component_configuration in configuration.components">
      <component_renderer :config="component_configuration"></component_renderer>
    </div>

    <div v-if="!component_configuration">
      Config missing. Please add a configuration for unity.
    </div>
  </div>
</template>

<script>
  import component_renderer from "./component_renderer.vue"

  export default {
    components: {component_renderer},
    name: 'applet.vue',
    mounted() {
      this.get_configuration()
    },
    data() {
      return {
        configuration: null
      }
    },
    methods: {
      get_configuration() {
        // get the instance.unity-config.json file
        fetch('/instance.unity-config.json')
          .then(res => {
            this.configuration = res
          })
          .catch(e => {
            // show dialog with error
            alert(e)
          })
        //
      },
      get_data() {
        fetch('responses').then((res) => {
          unity.set_data('responses', res)
        })

        fetch('plan').then((res) => {
          unity.set_data('plan', res)
        })
      },
      rerun_pipelines() {
        unity.rerun_pipelines()
      }
    }
  }
</script>

<style scoped>

</style>