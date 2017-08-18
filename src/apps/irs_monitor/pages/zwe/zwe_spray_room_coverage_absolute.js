import {Bar, mixins} from 'vue-chartjs'
import moment from 'moment-mini'

export default Bar.extend({
  props: ['responses', 'denominator'],
  watch: {},
  mounted () {
    this.renderChart({
      labels: ["Phase 1","Phase 2","Phase 3",],
      datasets: [
        {
          label: 'Sprayed',
          backgroundColor: "#33691E",
          data: [43,95,83]
        },
         {
          label: 'Not sprayed',
          backgroundColor: '#f87979',
          data: [57,5,17]
          
        }
      ]
    }, {
      title: {
        display: true,
        text: 'Spray room coverage absolute'
      },
      scales: {
        xAxes: [{
          stacked: true,
          // barThickness: 15
        }],
        yAxes: [{
          stacked: true,
        }]
      },
    })
  }
})
