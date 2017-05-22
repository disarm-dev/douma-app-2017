// CommitChart.js
import { Bar } from 'vue-chartjs'

export default Bar.extend({
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: ['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7','Week 8'],
      datasets: [
        {
          label: 'Spray progress',
          backgroundColor: '#f87979',
          data: [40, 20, 12, 39, 10, 40, 39, 80]
        }
      ]
    }, {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            max: 100,
            min: 0            
          }
        }]
      }
    })
  }
})