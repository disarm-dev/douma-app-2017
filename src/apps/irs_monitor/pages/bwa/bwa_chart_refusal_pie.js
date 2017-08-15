// CommitChart.js
import { Pie } from 'vue-chartjs'

export default Pie.extend({
  mounted () {
    this.renderChart({
      labels: ["Locked","Nobody","Refused","Baby","Patient","Kitchen ","Food ","Material"],
      datasets: [
        {
          backgroundColor: "#33691E",
          data: [28.2,2.7,32.2,4.5,1,10.7,2.4,18.3],
          backgroundColor: [
                "#d39bb2",
                "#981b21",
                "#ed7c79",
                "#1abe81",
                "#9bb62b",
                "#47b22d",
                "#c27707",
            ]
        }
      ]
    }, {
      title: {
        display: true,
        text: "Refusal Reasons for not spraying rooms (as a proportion of total number of rooms not sprayed)"
      },
      tooltips: {
        callbacks: {
          afterLabel(tooltipItem, data) {
            return '%'
          }
        }
      }
    })
  }
})
