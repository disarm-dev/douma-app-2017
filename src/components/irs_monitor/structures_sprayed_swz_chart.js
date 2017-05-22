// CommitChart.js
import { Line } from 'vue-chartjs'

export default Line.extend({
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: ['Week 1','Week 2','Week 3','Week 4','Week 5'],
      datasets: [
        {
          label: '% covered',
          // backgroundColor: 'transparent',
          fill: false,
          borderColor: '#EF5350',
          lineTension: 0,
          data: [2,8,10,18,20]
        }
      ]
    }, {
      title: {
        display: true, 
        text: "Proportion of target population covered"
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