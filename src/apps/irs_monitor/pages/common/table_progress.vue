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

  import Aggregations from '@/lib/aggregations'

  export default {
    components: {ClientTable},
    data() {
      return {
        loaded: false,
        tableData: null
      }
    },
    mounted() {
      const Aggregator = Aggregations[this.$store.state.instance_config.slug.toLowerCase()]

      this.tableData = new Aggregator({})
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
