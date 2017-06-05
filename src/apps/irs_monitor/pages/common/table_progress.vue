<template>
  <div v-if='loaded'>
    <a @click="log_form_elements">form_elements</a>
    <v-client-table :data="tableData" :columns="columns"></v-client-table>
    <md-button @click.native="download_content">Download</md-button>
  </div>
</template>

<script>
  import download from 'downloadjs'
  import json2csv from 'json2csv'
  import pick from 'lodash.pick'

  import Aggregator from '@/lib/aggregations'
  import {elements_array}from '@/lib/form_helpers'

  export default {
    props: ['responses', 'denominator', 'component_config'],
    data() {
      return {
        loaded: false,
        tableData: null
      }
    },
    mounted() {
      // this.load_data()
      console.log(this.component_config)
    },
    methods: {
      load_data(){
        this.columns = this.component_config.columns

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
      },
      log_form_elements() {
        console.table(elements_array(this.$store.state.instance_config.form))
      }

    }
  }
</script>
