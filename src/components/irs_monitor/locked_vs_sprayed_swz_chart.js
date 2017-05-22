// CommitChart.js
import { Line } from 'vue-chartjs'

export default Line.extend({
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: ['Week 1','Week 2','Week 3','Week 4','Week 5'],
      datasets: [
        {
          label: 'Sprayed',
          fill: false,
          borderColor: '#EF5350',
          lineTension: 0,
          data: [74,61,66,70,62]
        },
        {
          label: 'Locked',
          fill: false,
          borderColor: '#8BC34A',
          lineTension: 0,
          data: [26,39,34,30,38]
        }
      ]
    }, {
      title: {
        display: true,
        text: "Distribution of locked vs sprayed of structures visited"
      },
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