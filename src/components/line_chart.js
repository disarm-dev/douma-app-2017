// CommitChart.js
import { Line } from 'vue-chartjs'

export default Line.extend({
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: ['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7','Week 8'],
      datasets: [
        {
          label: 'Spray progress',
          backgroundColor: 'transparent',
          borderColor: '#EF5350',
          lineTension: 0,
          data: [40, 20, 12, 39, 10, 40, 39, 80]
        }
      ]
    })
  }
})