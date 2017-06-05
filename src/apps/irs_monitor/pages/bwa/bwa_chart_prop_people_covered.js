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
      console.log('this.responses', this.responses)
      let weeks = this.get_weeks()
      let data = weeks.map(week => this.get_data_for_week(week))
      console.log('weeks', weeks)
      console.log('data', data)

      this.renderChart({
        labels: weeks.map((week) => 'Week ' + week),
        datasets: [
          {
            label: 'Team 1',
            fill: false,
            borderColor: '#EF5350',
            lineTension: 0,
            data: data.team1
          },
          {
            label: 'Team 2',
            fill: false,
            borderColor: '#8BC34A',
            lineTension: 0,
            data: data.team2
          },
          {
            label: 'Team 3',
            fill: false,
            borderColor: '#7E57C2',
            lineTension: 0,
            data: data.team3
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
              max: 12000,
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
    get_data_for_week(week) {
      let responses = this.responses.filter(response => response.week === week)
      
      return Aggregations['number of people in homestead (total)'](responses, this.denominator)
    }
  }
})


