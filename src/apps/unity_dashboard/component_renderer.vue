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
    mounted() {
       unity.subscribe_to_pipeline({
         configuration: this.configuration,
         options: this.options,
         filters: this.filters
       })
       .then(data_to_render => {
         // do something with data_to_render
         this.data_to_render = data_to_render
       })

    }
  }
</script>

<style scoped>

</style>