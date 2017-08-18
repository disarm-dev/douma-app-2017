import {Bar, mixins} from 'vue-chartjs'
import moment from 'moment-mini'

export default Bar.extend({
  props: ['responses', 'denominator', 'height'],
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
            backgroundColor: ['#174ef5', '#f20006'],
            data: [1340, 750]
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
              beginAtZero: true
            }
          }]
        }
      })
  }
})
