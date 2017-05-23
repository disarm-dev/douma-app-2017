<template>
  <div v-if='loaded'>
    <v-client-table :data="tableData" :columns="columns"></v-client-table>
    <md-button @click.native="download_content">Download</md-button>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {ClientTable} from 'vue-tables-2'
  Vue.use(ClientTable)

  import download from 'downloadjs'
  import json2csv from 'json2csv'

  import Aggregator from '@/lib/aggregations'

  export default {
    data() {
      return {
        loaded: false,
        tableData: null
      }
    },
    mounted() {
      this.load_data()
    },
    methods: {
      load_data(){
        this.tableData = new Aggregator({instance_config: this.$store.state.instance_config})

        this.columns = Object.keys(this.tableData[0])
        this.loaded = true
      },
      download_content(){
        const fields = this.columns
        const data = this.tableData
        const content = json2csv({data, fields})

        download(content, 'output.csv')
      }
    }
  }
</script>
