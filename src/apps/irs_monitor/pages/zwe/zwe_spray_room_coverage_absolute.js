import {Bar, mixins} from 'vue-chartjs'
import moment from 'moment-mini'

export default Bar.extend({
  props: ['responses', 'denominator'],
  watch: {},
  mounted () {
    this.renderChart({
      labels: ["21 Aug","28 Aug","4 Sep"],
      datasets: [
        {
          label: 'Sprayed',
          backgroundColor: "#4CAF50",
          data: [43,95,83]
        },
         {
          label: 'Not sprayed',
          backgroundColor: '#F44336',
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
          stacked: true
        }],
        yAxes: [{
          scaleLabel: {
            display: true, 
            labelString: '# of rooms'
          },
          stacked: true
        }]
      },
    })
  }
})
