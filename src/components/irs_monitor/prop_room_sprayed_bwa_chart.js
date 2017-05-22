// CommitChart.js
import { Line } from 'vue-chartjs'

export default Line.extend({
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: ['Week 1','Week 2','Week 3','Week 4','Week 5', "Week 6","Week 7","Week 8","Week 9","Week 10"],
      datasets: [
        {
          label: 'Team 1',
          fill: false,
          borderColor: '#EF5350',
          lineTension: 0,
          data: [5,10,68,78,72,75,80,50,60,60]
        },
        {
          label: 'Team 2',
          fill: false,
          borderColor: '#8BC34A',
          lineTension: 0,
          data: [75,45,50,60,75,73,80]
        },
        {
          label: 'Team 3',
          fill: false,
          borderColor: '#7E57C2',
          lineTension: 0,
          data: [7,10,56,67,70,75,80,50,60,73]
        }
      ]
    }, {
      title: {
        display: true,
        text: 'Proportion of Rooms Sprayed/ Total number of rooms visited'
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
