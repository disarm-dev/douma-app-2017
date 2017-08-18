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
      labels: ['Sprayed', "Partially sprayed", "Not sprayed"],
      datasets: [
        {
          label: 'Spray status',
          backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
          data: [1340, 1721, 1450]
        }
      ]
    }, {
      title: {
        display: true,
        text: 'Spray status'
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
