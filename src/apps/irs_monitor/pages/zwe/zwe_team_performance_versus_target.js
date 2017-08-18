import {Bar, mixins} from 'vue-chartjs'
import moment from 'moment-mini'

export default Bar.extend({
  props: ['responses', 'denominator'],
  data() {
    return {
      labels: []
    }
  },
  watch: {},
  mounted () {
    this.renderChart({
        labels: ['Team A', "Team B"],
        datasets: [
          {
            label: '# of rooms sprayed',
            backgroundColor: '#4CAF50',
            lineTension: 0,
            data: [1340, 1721]
          }
        ]
      }, {
        title: {
          display: true,
          text: 'Performance versus target'
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 2000,
              min: 0
            }
          }]
        }
      })
  }
})
