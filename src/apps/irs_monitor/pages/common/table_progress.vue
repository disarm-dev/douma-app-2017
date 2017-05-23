<template>
  <div v-if='loaded'>
    <v-client-table :data="tableData" :columns="columns"></v-client-table>
    <md-button @click.native="download_content">Download</md-button>
  </div>
</template>
<script>
  import {ClientTable} from 'vue-tables-2'
  import download from 'downloadjs'
  import json2csv from 'json2csv'

  import NamAggregations from '@/lib/aggregations/nam.aggregations.js'

  export default {
    components: {ClientTable},
    data() {
      return {
        loaded: false,
        tableData: null
      }
    },
    mounted() {
      this.tableData = new NamAggregations({})
      this.columns = Object.keys(this.tableData[0])
      this.loaded = true
    },
    methods: {
      download_content(){
        const fields = this.columns
        const data = this.tableData
        const content = json2csv({data, fields})

        download(content, 'output.csv')
      }
    }
  }
</script>
