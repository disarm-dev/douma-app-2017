// CommitChart.js
import { Bar } from 'vue-chartjs'

export default Bar.extend({
  mounted () {
    this.renderChart({
      labels: ["Dvokodvweni","Gege","Hhukwini","Hlane","Hosea","Kubuta","Kukhanyeni","Kwaluseni","Lamgabhi","Lobamba","Lomahasha","Lubuli","Ludzeludze","Lugongolweni","Madlangempisi","Mafutseni","Mahlangatja","Mangcongco","Manzini","Maphalaleni","Maseyisini","Matsanjeni","Mayiwane","Mbabane","Mhlambanyatsi","Mhlangatane","Mhlume","Mkhiweni","Motjane","Mpholonjeni","Mthongwaneni","Mtsambama","Ndzingeni","Ngudzeni","Ngwempisi","Nhlambeni","Nkhaba","Nkilongo","Nkwene","Ntfonjeni","Ntondozi","Piggs Peak","Sandleni","Shiselweni I","Sigwe","Siphofaneni","Sithobela","Timpisini","Zombodze"],
      datasets: [
        {
          label: 'Sprayed',
          backgroundColor: "#33691E",
          data: [43,95,83,61,69,44,100,33,20,43,95,83,61,69,44,100,33,20,80,60,45,100,10,20,75,25,70,25,15,10,14,60,45,100,10,20,75,25,82,22,10,10,60,45,100,10,20,75,25]
        },
         {
          label: 'Locked',
          backgroundColor: '#f87979',
          data: [57,5,17,39,31,56,0,67,80,57,5,17,39,31,56,0,67,80,20,40,55,0,90,80,25,75,30,75,85,90,86,40,55,0,90,80,25,75,18,78,90,90,40,55,0,90,80,25,75]
          
        }
      ]
    }, {
      scales: {
        xAxes: [{
          stacked: true,
          barThickness: 5
        }],
        yAxes: [{
          stacked: true
        }]
      },
      title: {
        display: true,
        text: "Distribution of Locked vs sprayed of structures visited"
      }
    })
  }
})
