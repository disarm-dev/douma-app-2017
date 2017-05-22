<template>
  <div>
     <v-client-table :data="tableData" :columns="columns" :options="options"></v-client-table>
  </div>
</template>
<script>
  import Vue from 'vue'

  import {ServerTable, ClientTable, Event} from 'vue-tables-2';

  Vue.use(ClientTable)

  export default {
    data() {
      return {
        columns: ['name','homesteads_targeted','structures_targeted', "homesteads_found", "structures_found", "structures_sprayed", "sprayable_structures_refused", "sprayable_structures_not_sprayed"],
        tableData: [
          {"name": "Tsumeb", "homesteads_targeted": 6.483, "structures_targeted": 64.830, "homesteads_found": "434; 7%", "structures_found": "2,109; 3%", "structures_sprayed": "1,861; 3%", "sprayable_structures_refused": "6; 0%", "sprayable_structures_not_sprayed": "242; 11%"},
          {"name3": "Tsandi", "homesteads_targeted": 422, "structures_targeted": 4.220, "homesteads_found": "69; 16%", "structures_found": "775; 18%", "structures_sprayed": "548; 13%", "sprayable_structures_refused": "0; 0%", "sprayable_structures_not_sprayed": "103; 13%"},
          {"name": "Rundu", "homesteads_targeted": 18.326, "structures_targeted": 109.956, "homesteads_found": "4,842; 26%", "structures_found": "29,563; 27%", "structures_sprayed": "19,793; 18%", "sprayable_structures_refused": "527; 2%", "sprayable_structures_not_sprayed": "7,649; 26%"},
          {"name": "Outjo", "homesteads_targeted": 4.419, "structures_targeted": 17.676, "homesteads_found": "999; 23%", "structures_found": "4,294; 24%", "structures_sprayed": "3,618; 20%", "sprayable_structures_refused": "21; 0%", "sprayable_structures_not_sprayed": "521; 12%"},
          {"name": "Outapi", "homesteads_targeted": 6.311, "structures_targeted": 63.110, "homesteads_found": "538; 9%", "structures_found": "3,743; 6%", "structures_sprayed": "3,131; 5%", "sprayable_structures_refused": "28; 1%", "sprayable_structures_not_sprayed": "348; 9%"},
          {"name": "Otjiwarongo", "homesteads_targeted": 155, "structures_targeted": 620, "homesteads_found": "13; 8%", "structures_found": "46; 7%", "structures_sprayed": "36; 6%", "sprayable_structures_refused": "8; 17%", "sprayable_structures_not_sprayed": "2; 4%"},
          {"name": "Oshikuku", "homesteads_targeted": 1.096, "structures_targeted": 10.960, "homesteads_found": "0; 0%", "structures_found": "0; 0%", "structures_sprayed": "0; 0%", "sprayable_structures_refused": "0;", "sprayable_structures_not_sprayed": "0;"},
          {"name": "Oshakati", "homesteads_targeted": 19.557, "structures_targeted": 71.964, "homesteads_found": "4,809; 25%", "structures_found": "39,739; 55%", "structures_sprayed": "33,144; 46%", "sprayable_structures_refused": "786; 2%", "sprayable_structures_not_sprayed": "3,481; 9%"},
          {"name": "Opuwo", "homesteads_targeted": 19.078, "structures_targeted": 76.312, "homesteads_found": "1,111; 6%", "structures_found": "6,923; 9%", "structures_sprayed": "4,251; 6%", "sprayable_structures_refused": "69; 1%", "sprayable_structures_not_sprayed": "1,390; 20%"},
          {"name": "Onandjokwe", "homesteads_targeted": 17.763, "structures_targeted": 177.630, "homesteads_found": "1,961; 11%", "structures_found": "23,814; 13%", "structures_sprayed": "19,608; 11%", "sprayable_structures_refused": "131; 1%", "sprayable_structures_not_sprayed": "2,614; 11%"},
          {"name": "Okongo", "homesteads_targeted": 1.974, "structures_targeted": 15.792, "homesteads_found": "404; 20%", "structures_found": "4,913; 31%", "structures_sprayed": "3,727; 24%", "sprayable_structures_refused": "70; 1%", "sprayable_structures_not_sprayed": "412; 8%"},
          {"name": "Okakarara", "homesteads_targeted": 4.363, "structures_targeted": 17.452, "homesteads_found": "684; 16%", "structures_found": "3,849; 22%", "structures_sprayed": "3,497; 20%", "sprayable_structures_refused": "11; 0%", "sprayable_structures_not_sprayed": "249; 6%"},
          {"name": "Okahao", "homesteads_targeted": 119, "structures_targeted": 1.190, "homesteads_found": "26; 22%", "structures_found": "328; 28%", "structures_sprayed": "244; 21%", "sprayable_structures_refused": "0; 0%", "sprayable_structures_not_sprayed": "63; 19%"},
          {"name": "Nyangana", "homesteads_targeted": 7.920, "structures_targeted": 47.520, "homesteads_found": "2,930; 37%", "structures_found": "16,680; 35%", "structures_sprayed": "11,613; 24%", "sprayable_structures_refused": "542; 3%", "sprayable_structures_not_sprayed": "4,375; 26%"},
          {"name": "Nankudu", "homesteads_targeted": 13.454, "structures_targeted": 80.724, "homesteads_found": "3,821; 28%", "structures_found": "20,644; 26%", "structures_sprayed": "13,622; 17%", "sprayable_structures_refused": "775; 4%", "sprayable_structures_not_sprayed": "5,181; 25%"},
          {"name": "Khorixas", "homesteads_targeted": 913, "structures_targeted": 3.652, "homesteads_found": "971; 106%", "structures_found": "3,112; 85%", "structures_sprayed": "3,096; 85%", "sprayable_structures_refused": "5; 0%", "sprayable_structures_not_sprayed": "31; 1%"},
          {"name": "Katima Mulilo", "homesteads_targeted": 43.201, "structures_targeted": 86.402, "homesteads_found": "15,504; 36%", "structures_found": "23,556; 27%", "structures_sprayed": "19,224; 22%", "sprayable_structures_refused": "520; 2%", "sprayable_structures_not_sprayed": "3,029; 13%"},
          {"name": "Grootfontein", "homesteads_targeted": 2.161, "structures_targeted": 8.644, "homesteads_found": "313; 14%", "structures_found": "1,355; 16%", "structures_sprayed": "1,137; 13%", "sprayable_structures_refused": "49; 4%", "sprayable_structures_not_sprayed": "65; 5%"},
          {"name": "Engela", "homesteads_targeted": 18.933, "structures_targeted": 189.330, "homesteads_found": "3,820; 20%", "structures_found": "53,376; 28%", "structures_sprayed": "43,814; 23%", "sprayable_structures_refused": "741; 1%", "sprayable_structures_not_sprayed": "5,341; 10%"},
          {"name": "Eenhana", "homesteads_targeted": 8.357, "structures_targeted": 66.856, "homesteads_found": "1,355; 16%", "structures_found": "20,228; 30%", "structures_sprayed": "15,783; 24%", "sprayable_structures_refused": "373; 2%", "sprayable_structures_not_sprayed": "1,916; 9%"},
          {"name": "Andara", "homesteads_targeted": 13.247, "structures_targeted": 79.482, "homesteads_found": "2,760; 21%", "structures_found": "16,857; 21%", "structures_sprayed": "12,590; 16%", "sprayable_structures_refused": "418; 2%", "sprayable_structures_not_sprayed": "3,268; 19%"},
          {"name": "Total", "homesteads_targeted": 208.252, "structures_targeted": "1.194.322", "homesteads_found": "47,364; 23%", "structures_found": "275,904; 23%", "structures_sprayed": "214,337; 18%", "sprayable_structures_refused": "5,080; 2%", "sprayable_structures_not_sprayed": "40,280; 15%"}
        ],
        options: {
          // see the options API
        }
      }
    },
    mounted() {

    }
  }
</script>