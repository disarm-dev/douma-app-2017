import {Line} from 'vue-chartjs'
import moment from 'moment'

import Aggregations from 'lib_instances/aggregations/bwa.aggregations'
import {get_temporally_binned_aggregations} from 'lib/binning/temporal_bins'
window.get_temp = get_temporally_binned_aggregations
window.test_filter = {
    // interval: 'months',
//     // raw_responses: true,
//     // start_date: '2017-01-01',
//     // start_date: '2017-03-01',
//     // end_date: '2017-04-02'
//     // end_date: '2017-02-02'
//     // end_date: '2017-02-15'
  }

export default Line.extend({
  // name: 'bwa_chart_prop_people_covered',
  props: ['responses', 'denominator'],
  watch: {
    // 'responses': 'create_chart'
  },
  mounted () {
    // const data = this.prepare_responses(this.responses)
    this.create_chart()
  },
  methods: {
    create_chart() {
      // let weeks = this.get_weeks()

      // let data = weeks.map(week => {
      //   let responses = this.responses.filter(response => response.week === week)
      //   return this.get_data_for_week(responses, week)
      // })

      this.renderChart({
        labels: ['Week 1', "Week 2", "Week 3", "Week 4", "Week 5"],
        datasets: [
          {
            label: 'Team 1',
            fill: false,
            borderColor: '#EF5350',
            lineTension: 0,
            data: [1200, 1580, 1300, 1750, 1900]
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
              // max: 100,
              // min: 0
            }
          }]
        }
      })

    },
    //  get_weeks() {
    //   return this.responses
    //   .reduce((acc, response) => {
    //     if (!acc.includes(response.week)) {
    //       acc.push(response.week)
    //     }
    //     return acc
    //   }, []).sort()
    // },
    // get_data_for_week(responses, week) {
    //   return Aggregations['number of people in homestead (total)'](responses, this.denominator)
    // }
  }
})


