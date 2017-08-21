<template>
  <div :id="div_id"></div>
</template>

<script>
export default {
  name: 'custom_chart',
  props: ['div_id', 'get_data', 'layout', 'width_constraint', 'height_constraint'],
  data () {
    return {
    };
  },
  mounted() {
    const data = this.get_data()

    Plotly.newPlot(this.div_id, data, this.layout, {displayModeBar: false});
  }
};
</script>

<style lang="css" scoped>
</style>