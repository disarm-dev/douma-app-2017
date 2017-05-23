// CommitChart.js
import {Line} from 'vue-chartjs'
import moment from 'moment'

export default Line.extend({
  props: ['responses', 'denominator'],
  data() {
    return {
      labels: []
    }
  },
  mounted () {
    const data = this.prepare_responses(this.responses)

    this.renderChart({
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
    }, {
      title: {
        display: true,
        text: 'Proportion of People covered/ Number of People Found'
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
  methods: {
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
        output[team][week_index] ? output[team][week_index] += 1 : output[team][week_index] = 1
      })

      return output

    }
  }
})
