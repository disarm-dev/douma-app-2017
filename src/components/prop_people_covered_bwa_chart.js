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
          data: [0,50,75,80,85,80,100,95,80,75]
        },
        {
          label: 'Team 2',
          fill: false,
          borderColor: '#8BC34A',
          lineTension: 0,
          data: [0,30,50,70,85,90,95,85,95,100]
        },
        {
          label: 'Team 3',
          fill: false,
          borderColor: '#7E57C2',
          lineTension: 0,
          data: [0,45,50,70,80,90,93]
        }
      ]
    }, {
      title: {
        display: true,
        text: 'Proportion of People covered/ Number of People Found'
      }
    })
  }
})
