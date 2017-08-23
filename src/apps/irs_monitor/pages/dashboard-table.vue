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
  import moment from 'moment-mini'
  import {mapState} from 'vuex'

  import get_data from '../lib/get_data_for_viz'

  export default {
    props: ['responses', 'targets', 'options'],
    computed: {
      ...mapState({
        slug: state => state.instance_config.instance.slug,
        aggregations: state => state.instance_config.aggregations
      }),
      table_columns() {
        return ['1', '2']
      },
      table_data() {
        const data = get_data({
          responses: this.responses, 
          targets: this.targets, 
          aggregations: this.aggregations,
          options: this.options
        })
        console.log('table_data', data)

        return [{ 1: 1, 2: 2 }, {1: 1, 2: 2}] 
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
