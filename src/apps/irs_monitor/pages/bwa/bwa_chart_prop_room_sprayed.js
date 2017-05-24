import {Line, mixin} from 'vue-chartjs'
const {reactiveProp} = mixins
import moment from 'moment'

import aggregations from '@/lib/aggregations/bwa.aggregations'

export default Line.extend({
  mixins: [reactiveProp],
  props: ['responses', 'denominator'],
  data() {
    return {
      labels: [],
      chart_options: {
        title: {
          display: true,
            text: 'NUMBER of Rooms Sprayed/ Total number of rooms visited'
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
      }
    }
  },
  watch: {},
  mounted () {
    const data = this.prepare_responses(this.responses)
    this.create_chart()
  },
  computed: {
    chart_data() {
       return {
          labels: this.labels,
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
      }
    }
  },
  methods: {
    create_chart() {
      this.renderChart(this.chart_data, this.chart_options)

    },
    prepare_responses(responses) {
      let output = {team1: [], team2: [], team3: []}
      let labels = []

      responses = responses.map(response => {
        const week_number = parseInt(moment(response.recorded_on).week(), 10)
        response._week = week_number
        if (!labels.includes(week_number)) {
          labels.push(week_number)
        }
        return response
      })
      this.labels = labels.sort((a, b) => a - b)

      responses.forEach(response => {
        const week_index = labels.indexOf(response._week)
        const team = response.team
        if (output[team][week_index]) {
          output[team][week_index].push(response)
        } else {
          output[team][week_index] = [response]
        }
      })

      Object.keys(output).forEach(team_id => {
        const team_weeks = output[team_id]
        team_weeks.forEach((team_week, index) => {
          output[team_id][index] = this.do_aggregation(output[team_id][index], this.denominator, {})
        })
        return team_weeks
      })

      return output

    },
    do_aggregation(responses, denominator) {
      return aggregations['number of rooms sprayed (total)'](responses, denominator)
    }
  }
})
