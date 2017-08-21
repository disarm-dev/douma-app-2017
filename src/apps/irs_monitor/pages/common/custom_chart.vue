<template>
  <div :id="div_id"></div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'custom_chart',
    props: ['div_id', 'get_data', 'layout', 'width_constraint', 'height_constraint', 'responses'],
    computed: {
      ...mapState({
        aggregations: state => state.instance_config.aggregations
      })
    },
    mounted() {
      const data = this.get_data({responses: this.responses, denominators: [], aggregations: this.aggregations})

      Plotly.newPlot(this.div_id, data, this.layout, {displayModeBar: false})
    }
  }
</script>

<style lang="css" scoped>
</style>
