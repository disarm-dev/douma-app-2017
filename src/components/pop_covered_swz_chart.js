// CommitChart.js
import { Line } from 'vue-chartjs'

export default Line.extend({
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: ['Week 1','Week 2','Week 3','Week 4','Week 5'],
      datasets: [
        {
          label: 'Proportion of target  population covered',
          // backgroundColor: 'transparent',
          fill: false,
          borderColor: '#EF5350',
          lineTension: 0,
          data: [1,1,2,5,7]
        }
      ]
    })
  }
})