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
      // This could live inside of a mixin, leaving here for now also in unity-block-plugin.js
      this.get_default_options_and_filters()

      this.$unity.subscribe_to_pipeline() // TODO: @unity .subscribe_to_pipeline() should either accept a function or return 'stream'
        .on(data_to_render => {
          // this function gets called every time something related to this pipeline changes
          this.data_to_render = data_to_render
        })
    },
    destroyed() {
      this.$unity.unsubscribe_to_pipeline() // TODO: @unity .unsubscribe_to_pipeline()
    },
    methods: {
      update_filters_for_pipeline() {
        this.$unity.update_filters_for_pipeline(pipeline_id) // TODO: @unity .update_filters_for_pipeline() needs to update the filters
        // Call $unity.rerun_pipeline() here?
      }
    }
  }
</script>

<style scoped>

</style>