<template>
  <md-card class="card">
    <md-card-content>

      <v-client-table :data="table_data" :columns="table_columns"></v-client-table>
      <md-button @click.native="download_aggregations">Download</md-button>

    </md-card-content>
  </md-card>
</template>

<script>
  import download from 'downloadjs'
  import json2csv from 'json2csv'
  import moment from 'moment'
  import numeral from 'numeral'
  import Presenters from 'lib_instances/presenters'

  export default {
    props: ['aggregated_responses'],
    computed: {
      slug() {
        return this.$store.state.instance_config.slug
      },
      table_columns() {
        if (this.aggregated_responses.length === 0) return []
        return Object.keys(this.aggregated_responses[0])
      },
      table_data() {
        if (this.aggregated_responses.length === 0) return []
        // Filter/pluck to get just the columns needed for the table
        const columns_to_format = this.table_columns.filter(column => /\%$/.test(column))

        const presented_rows = this.aggregated_responses.map(row => {
          // If we don't copy the row, we are editing aggregated responses.
          // This stops the map from showing the correct coverage
          let new_row = {...row}
          columns_to_format.forEach(column => {
            new_row[column] = numeral(row[column]).format('0.[0]%')
          })
          return new_row
        })

        return presented_rows
      }
    },
    methods: {
      download_aggregations(){
        const fields = this.table_columns
        const data = this.table_data
        const content = json2csv({data, fields})
        const date = moment().format('YYYY-MM-DD_HHmm')
        download(content, `${this.slug}_irs_progress_${date}.csv`)
        this.$ga.event('irs_monitor','click_download_progress_table')
      }
    }
  }
</script>
