// CommitChart.js
import { Bar } from 'vue-chartjs'

export default Bar.extend({
  mounted () {
    this.renderChart({
      labels: ["Locked","Nobody","Refused","Baby","Patient","Kitchen ","Food ","Material"],
      datasets: [
        {
          label: 'Refusal reasons',
          data: [28.2,2.7,32.2,4.5,1,10.7,2.4,18.3],
          backgroundColor: ["#d39bb2","#981b21","#ed7c79","#1abe81","#9bb62b","#47b22d","#c27707"]
        }
      ]
    }, {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Refusal reason absolute"
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true, 
            labelString: '# of households'
          }
        }]
      }
    })
  }
})
