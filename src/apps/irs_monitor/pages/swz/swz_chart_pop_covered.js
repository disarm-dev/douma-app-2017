// CommitChart.js
import { Line } from 'vue-chartjs'
import Aggregations from '@/lib/aggregations/swz.aggregations'

export default Line.extend({
  props: ['responses', 'denominator'],
  watch: {
    'responses': 'render_chart'
  },
  methods: {
    render_chart() {
      console.log('TODO: @data THIS IS FAKE DATA. FIX ME')

      let weeks = this.get_weeks()

      this.renderChart({
        labels: weeks.map((week) => 'Week ' + week),
        datasets: [
          {
            label: '% covered',
            // backgroundColor: 'transparent',
            fill: false,
            borderColor: '#EF5350',
            lineTension: 0,
            data: weeks.map(week => this.get_data_for_week(week))
          }
        ]
      }, {
        title: {
          display: true, 
          text: "Structures found %"
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
    },
    get_weeks() {
      return this.responses
      .reduce((acc, response) => {
        if (!acc.includes(response.week)) {
          acc.push(response.week)
        }
        return acc
      }, []).sort()
    },
    get_data_for_week(week) {
      let responses = this.responses.filter(response => response.week === week)
      
      return Aggregations['structures found %'](responses, this.denominator)
    }

  }
})