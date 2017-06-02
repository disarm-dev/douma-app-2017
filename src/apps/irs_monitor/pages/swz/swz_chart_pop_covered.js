// CommitChart.js
import { Line } from 'vue-chartjs'

export default Line.extend({
  props: ['responses', 'denominator'],
  watch: {
    'responses': 'render_chart'
  },
  mounted () {
    // Overwriting base render method with actual data.
    
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
          text: "Proportion of target population covered"
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
    get_data_for_week(week) {
      let structures_sprayed = this.responses
      .filter(response => response.week === week)
      .reduce((acc, response) => {
        if (response.form_data.hasOwnProperty('number_of_structures_sprayed')) {
          acc += response.form_data.number_of_structures_sprayed
        }
        return acc
      }, 0)


      let population = structures_sprayed * 5

      return (population / this.denominator.population) * 100
    }

  }
})