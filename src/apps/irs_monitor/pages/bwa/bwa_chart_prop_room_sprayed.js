import {Line, mixins} from 'vue-chartjs'
import moment from 'moment'

import aggregations from '@/lib/aggregations/bwa.aggregations'

export default Line.extend({
  props: ['records', 'denominator'],
  data() {
    return {
      labels: []
    }
  },
  watch: {},
  mounted () {
    const data = this.prepare_records(this.records)
    this.create_chart(data, this.labels)
  },
  methods: {
    create_chart(data, labels) {
      this.renderChart({
        labels: labels,
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
      })

    },
    prepare_records(records) {
      let output = {team1: [], team2: [], team3: []}
      let labels = []

      records = records.map(record => {
        const week_number = parseInt(moment(record.recorded_on).week(), 10)
        record._week = week_number
        if (!labels.includes(week_number)) {
          labels.push(week_number)
        }
        return record
      })
      this.labels = labels.sort((a, b) => a - b)

      records.forEach(record => {
        const week_index = labels.indexOf(record._week)
        const team = record.team
        if (output[team][week_index]) {
          output[team][week_index].push(record)
        } else {
          output[team][week_index] = [record]
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
    do_aggregation(records, denominator) {
      return aggregations['number of rooms sprayed (total)'](records, denominator)
    }
  }
})
