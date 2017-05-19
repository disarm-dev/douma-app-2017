// CommitChart.js
import { Doughnut } from 'vue-chartjs'

export default Doughnut.extend({
  mounted () {
    this.renderChart({
      labels: ['Sprayed', "Refused", "Other"],
      datasets: [
        {
          // label: "",
          backgroundColor: "#33691E",
          data: [22, 2, 66],
          backgroundColor: [
                "#8BC34A",
                "#FF9800",
                "#9E9E9E"
            ],
            hoverBackgroundColor: [
                "#33691E",
                "#E65100",
                "#424242"
            ]
        }
      ]
    })
  }
})
