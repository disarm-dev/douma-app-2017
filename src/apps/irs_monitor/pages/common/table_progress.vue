<template>
  <div v-if='loaded'>
    <v-client-table :data="tableData" :columns="columns"></v-client-table>
    <md-button @click.native="download_content">Download</md-button>
  </div>
</template>

<script>
  import download from 'downloadjs'
  import json2csv from 'json2csv'
  import pick from 'lodash.pick'

  import Aggregator from '@/lib/aggregations'

  export default {
    props: ['records', 'denominator', 'component_config'],
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
        this.columns = this.component_config.columns

        const data = new Aggregator({
          records: this.records,
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
