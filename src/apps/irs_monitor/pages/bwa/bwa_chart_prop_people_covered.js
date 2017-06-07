import {Line} from 'vue-chartjs'
import moment from 'moment'

import Aggregations from '@/lib/aggregations/bwa.aggregations'

export default Line.extend({
  props: ['responses', 'denominator'],
  watch: {
    'responses': 'create_chart'
  },
  // mounted () {
  //   const data = this.prepare_responses(this.responses)
  //   this.create_chart(data, this.labels)
  // },
  methods: {
    create_chart() {
      let weeks = this.get_weeks()
      
      let data = weeks.map(week => {
        let responses = this.responses.filter(response => response.week === week)
        return this.get_data_for_week(responses, week)
      })

      this.renderChart({
        labels: weeks.map((week) => 'Week ' + week),
        datasets: [
          {
            label: 'Team 1',
            fill: false,
            borderColor: '#EF5350',
            lineTension: 0,
            data: data
          }
        ]
      }, {
        title: {
          display: true,
          text: 'NUMBER of People covered/ Number of People Found'
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 100,
              min: 0
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
    get_data_for_week(responses, week) {
      return Aggregations['number of people in homestead (total)'](responses, this.denominator)
    }
  }
})


