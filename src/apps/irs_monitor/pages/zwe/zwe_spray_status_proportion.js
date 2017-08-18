import {Pie, mixins} from 'vue-chartjs'
import moment from 'moment-mini'

export default Pie.extend({
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
          label: 'Household Coverage',
          backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
          data: [25, 25, 50]
        }
      ]
    }, {
      title: {
        display: true,
        text: 'Spray status'
      }
    })
  }
})
