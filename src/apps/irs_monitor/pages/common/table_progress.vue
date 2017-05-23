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
  import pick from 'lodash.pick'

  import Aggregator from '@/lib/aggregations'

  export default {
    props: ['responses', 'denominator'],
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
        this.columns = ['village', 'number of buildings targeted', 'number of people in the homestead (<5 yrs)', 'number of people in the homestead (>5 yrs)', 'number of buildings visited', 'number of rooms visited', 'number of rooms sprayed (total)', 'number of rooms sprayed (DDT)', 'number of rooms sprayed (lambda-cyhalothrin)']

        const data = new Aggregator({
          responses: this.responses,
          denominator: this.denominator, 
          instance_config: this.$store.state.instance_config
        })

        this.tableData = data.map(row => {
          return pick(row, this.columns)
        })

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
