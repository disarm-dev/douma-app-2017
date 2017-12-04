<template>
  <component :is="configuration.component_type" :data_to_render="data_to_render"></component>
</template>

<script>
  import chart from './components/chart'
  import table from './components/table'

  export default {
    name: 'component_renderer',
    components: {chart, table},
    props: 'configuration',
    data() {
      return {
        data_to_render: null, // where does this come from?
      }
    },
    computed: {
      filters: {
        get() {
        },
        set(value) {
          // incl. this.$unity.run_pipeline()
        }
      }
    },
    mounted() {
      this.get_default_options_and_filters()

      this.$unity.subscribe_to_pipeline()
        .on(data_to_render => {
          // this function gets called every time something related to this pipeline changes
          this.data_to_render = data_to_render
        })
    },
  }
</script>

<style scoped>

</style>