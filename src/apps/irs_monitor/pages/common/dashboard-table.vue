<template>
  <div>
    <v-client-table :data="tableData" :columns="columns"></v-client-table>
    <md-button @click.native="download_content">Download</md-button>
  </div>
</template>

<script>
  import download from 'downloadjs'
  import json2csv from 'json2csv'
  import moment from 'moment'
  import numeral from 'numeral'
  import Presenters from 'lib/presenters'

  export default {
    props: ['response_aggregations'],
    data() {
      return {
        tableData: [],
        columns: []
      }
    },
    computed: {
      instance_config() {
        return this.$store.state.instance_config
      }
    },
    watch: {
      'responses': 'prepare_table_data',
    },
    mounted() {
      this.prepare_table_data()
    },
    methods: {
      prepare_table_data(){
        if (this.response_aggregations.length === 0) return

        // Filter/pluck to get just the columns needed for the table
        this.columns = Object.keys(this.response_aggregations[0])
        const columns_to_format = this.columns.filter(column => /\%$/.test(column))

        const presented_rows = this.response_aggregations.map(row => {
          columns_to_format.forEach(column => {
            row[column] = numeral(row[column]).format('0.[0]%')
          })
          return row
        })

        this.tableData = presented_rows

      },
      download_content(){
        const fields = this.columns
        const data = this.tableData
        const content = json2csv({data, fields})
        const date = moment().format('YYYY-MM-DD_HHmm')
        download(content, `${this.instance_config.slug}_irs_progress_${date}.csv`)
      }
    }
  }
</script>
