// CommitChart.js
import { Doughnut } from 'vue-chartjs'

export default Doughnut.extend({
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
    })
  }
})