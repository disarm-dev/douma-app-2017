<template>
  <div :id="div_id"></div>
</template>

<script>
export default {
  name: 'custom_chart',
  props: ['div_id', 'get_data', 'get_layout', 'width_constraint', 'height_constraint'],
  data () {
    return {
    };
  },
  mounted() {
    const data = this.get_data()
    const layout = this.get_layout()

    Plotly.newPlot(this.div_id, data, layout, {displayModeBar: false});

  }
};
</script>

<style lang="css" scoped>
</style>