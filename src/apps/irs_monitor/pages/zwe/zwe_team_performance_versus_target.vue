<template>
  <div id="chart"></div>
</template>

<script>
export default {
  name: 'zwe_team_performance_versus_target',
  mounted() {
    const team1 = {
      x: ['Team 1'],
      y: [1340],
      type: 'bar',
      name: 'Team 1',
      marker: {
        color: 'rgba(204,204,204,1)'
      }
    }

    const team2 = {
      x: ['Team 2'],
      y: [750],
      type: 'bar',
      name: 'Team 2',
      marker: {
        color: 'rgba(222,45,38,0.8)'
      }
    }

    const layout = {
      showlegend: true,
      title: 'Performance versus target',
      yaxis: {
        title: "# of rooms"
      },
      xaxis: {
        title: 'Teams'
      }
    };

    Plotly.newPlot('chart', [team1, team2], layout, {displayModeBar: false});
  }
};


</script>

<style lang="css" scoped>
  #chart {
    width: 100%;
  }
</style>