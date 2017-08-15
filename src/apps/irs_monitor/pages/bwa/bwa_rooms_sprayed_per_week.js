import {Bar} from 'vue-chartjs'

export default Bar.extend({
  mounted () {
    this.renderChart(
      {
        labels: ['Week 32', 'Week 33', 'Week 34', 'Week 35', 'Week 36'],
        datasets: [
          {
            label: 'Rooms sprayed',
            backgroundColor: '#4CAF50',
            data: [320, 215, 273, 481, 345]
          }
        ]
      }, 
      {
        title: {
          display: true,
          text: "Total Number of Rooms Sprayed per Week"
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: '# of rooms'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Week numbers'
            }
          }]
        }
      }
    )
  }
})