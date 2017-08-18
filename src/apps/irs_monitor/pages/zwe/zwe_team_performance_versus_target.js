import {Line} from 'vue-chartjs'
import moment from 'moment-mini'

export default Line.extend({
  props: ['responses', 'denominator'],
  mounted () {
    this.renderChart({
        labels: ['Week 1', "Week 2", "Week 3", "Week 4", "Week 5"],
        datasets: [
          {
            label: 'Team 1',
            fill: false,
            borderColor: '#EF5350',
            lineTension: 0,
            data: [1200, 1580, 1300, 1750, 1900]
          }
        ]
      }, {
        title: {
          display: true,
          text: 'Team performance versus target'
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              // max: 100,
              // min: 0
            }
          }]
        }
      })
  }
})


