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
            data: [1340, 1721, 1643, 1945, 1600]
          },
          {
            label: 'Team 2',
            fill: false,
            borderColor: '#8BC34A',
            lineTension: 0,
            data: [1440, 1811, 1453, 1750, 1900]
          },
          {
            label: 'Team 3',
            fill: false,
            borderColor: '#7E57C2',
            lineTension: 0,
            data: [1240, 1521, 1143, 1645, 1800]
          }
        ]
      }, {
        title: {
          display: true,
          text: 'Spray room coverage proportion'
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
