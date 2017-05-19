// CommitChart.js
import { Line } from 'vue-chartjs'

export default Line.extend({
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: ['Week 1','Week 2','Week 3','Week 4','Week 5'],
      datasets: [
        {
          label: 'Proportion of population covered of structures visited',
          fill: false,
          borderColor: '#EF5350',
          lineTension: 0,
          data: [65,74,80,81,88]
        }
      ]
    })
  }
})


