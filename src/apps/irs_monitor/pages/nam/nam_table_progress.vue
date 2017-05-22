<template>
  <div>
     <!--<v-client-table ref='table' v-if='loaded' :columns="columns" :data="tableData"></v-client-table>-->
  </div>
</template>
<script>
  import Vue from 'vue'
  import {ServerTable, ClientTable, Event} from 'vue-tables-2';
  Vue.use(ClientTable)

  import Translations from '@/lib/translations'

  export default {
    data() {
      return {
        loaded: false,
        columns: [],
        tableData: null
      }
    },
    mounted() {
      this.calculate_table_content()
    },
    methods: {
      add_translations() {
        // get instance translator
        // get responses
        // translate responses
        // aggregate responses
      },
      calculate_table_content() {

        this.columns = [ // Namibia columns
          "name",
          "homesteads_targeted",
          "structures_targeted",
          "homesteads_found",
          "structures_found",
          "structures_sprayed",
          "sprayable_structures_refused",
          "sprayable_structures_not_sprayed"
        ]


        this.tableData = [
          {name: '3', homesteads_targeted: 4},
        ]

        this.loaded = true
      }
    }
  }
</script>
