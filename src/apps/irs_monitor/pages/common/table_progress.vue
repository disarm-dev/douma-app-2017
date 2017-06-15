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
  import Presenters from 'lib/presenters'

  export default {
    props: ['responses', 'denominator'],
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
        if (this.responses.length === 0) return

        const instance_presenters = new Presenters[this.instance_config.slug](this.instance_config) // TODO: @refac Improve signature, remove duplication
        const data = instance_presenters.getTableData(this.responses, this.denominator)

        this.columns = Object.keys(data[0])
        this.tableData = data
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
