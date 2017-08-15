import {Line, mixins} from 'vue-chartjs'
import moment from 'moment-mini'

// import aggregations from '../../../../../static/instances/bwa.aggregations.json'

export default Line.extend({
  props: ['responses', 'denominator'],
  data() {
    return {
      labels: []
    }
  },
  watch: {},
  mounted () {
    // const data = this.prepare_responses(this.responses)
    this.create_chart() //data, this.labels)
  },
  methods: {
    create_chart(data, labels) {
      this.renderChart({
        labels: ['Week 32', "Week 33", "Week 34", "Week 35", "Week 36"],
        datasets: [
          {
            label: 'Coverage',
            fill: false,
            borderColor: '#EF5350',
            lineTension: 0,
            data: [60, 72, 83, 65, 79]
          }
        ]
      }, {
        title: {
          display: true,
          text: 'Proportion of Rooms Sprayed/Total Number of Rooms Visited'
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: '% coverage'
            },
            ticks: {
              callback: function(value, index, values) {
                return value + '%'
              },
              beginAtZero: true,
              max: 100,
              min: 0
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Week numbers'
            }
          }]
        },
        tooltips: {
          callbacks: {
            afterLabel(tooltipItem, data) {
              return '%'
            }
          }
        }
      })

    },
    // prepare_responses(responses) {
    //   let output = {team1: [], team2: [], team3: []}
    //   let labels = []

    //   responses = responses.map(response => {
    //     const week_number = parseInt(moment(response.recorded_on).week(), 10)
    //     response._week = week_number
    //     if (!labels.includes(week_number)) {
    //       labels.push(week_number)
    //     }
    //     return response
    //   })
    //   this.labels = labels.sort((a, b) => a - b)

    //   responses.forEach(response => {
    //     const week_index = labels.indexOf(response._week)
    //     const team = response.team
    //     if (output[team][week_index]) {
    //       output[team][week_index].push(response)
    //     } else {
    //       output[team][week_index] = [response]
    //     }
    //   })

    //   Object.keys(output).forEach(team_id => {
    //     const team_weeks = output[team_id]
    //     team_weeks.forEach((team_week, index) => {
    //       output[team_id][index] = this.do_aggregation(output[team_id][index], this.denominator, {})
    //     })
    //     return team_weeks
    //   })

    //   return output

    // },
    // do_aggregation(responses, denominator) {
    //   return aggregations['number of rooms sprayed (total)'](responses, denominator)
    // }
  }
})
