<template>
  <!--Filters or controls etc. -->
  <input v-model="options.some_number" type="number" placeholder="Some numeric value">

  <!--component to render-->
  <template :is="configuration.component_type" :data_to_render="data_to_render"></template>

</template>

<script>
  import chart from './chart'
  import table from './table'

  export default {
    name: 'component_renderer',
    components: {chart, table},
    props: 'configuration',
    data() {
      return {
        data_to_render: null,
        options: {
          some_number: 1
        },
        filters: []
      }
    },
    watch: {
      'options': 'update_pipeline',
      'filters': 'update_pipeline',
    },
    mounted() {
      this.get_default_options_and_filters()

      unity.subscribe_to_pipeline({
        configuration: this.configuration,
        options: this.options,
        filters: this.filters
      })
        .then(data_to_render => {
          // this function gets called every time something related to this pipeline changes

          this.data_to_render = data_to_render
        })
    },
    update_pipeline() {
      // set the options and filters after have subscribed the first time
      unity.update_pipeline({
        configuration: this.configuration,
        options: this.options,
        filters: this.filters
      })
    },

    get_default_options_and_filters() {
      // get the filters and options that were persisted
      // i.e. from localStorage / IDB

      this.options = options
      this.filters = filters
    }
  }
</script>

<style scoped>

</style>