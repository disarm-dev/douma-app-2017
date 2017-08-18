import {Line, mixins} from 'vue-chartjs'
import moment from 'moment-mini'

export default Line.extend({
  props: ['responses', 'denominator'],
  data() {
    return {
      labels: []
    }
  },
  watch: {},
  mounted () {
    this.renderChart({
        labels: ['Week 1', "Week 2", "Week 3", "Week 4", "Week 5"],
        datasets: [
          {
            label: 'Team 1',
            fill: false,
            borderColor: '#EF5350',
            lineTension: 0,
            data: [10, 35, 45, 65, 78]
          }
        ]
      }, {
        title: {
          display: true,
          text: 'Proportion of Rooms Sprayed/Total Number of Rooms Targeted'
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 100,
              min: 0,
              callback: (value, index, values) => {
                return value + '%'
              }
            }
          }]
        }
      })
  }
})
