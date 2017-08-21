<template>
  <div id="chart"></div>
</template>

<script>
export default {
  name: 'zwe_team_performance_versus_target',
  mounted() {
    const set1 = {
      x: ['Team 1', 'Team 2'],
      y: [1340, 750],
      type: 'bar',
      marker: {
        color: ['rgba(204,204,204,1)', 'rgba(222,45,38,0.8)']
      }
    }

    const layout = {
      showlegend: true,
      title: 'Performance versus target',
      yaxis: {
        title: "# of rooms"
      },
      axis: {
        title: 'teams'
      }
    };

    Plotly.newPlot('chart', [set1], layout, {displayModeBar: false});
  }
};


</script>

<style lang="css" scoped>
  #chart {
    width: 100%;
  }
</style>