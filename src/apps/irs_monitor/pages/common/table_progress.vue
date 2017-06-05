<template>
  <div v-if='loaded'>
    <!-- <a @click="log_form_elements">form_elements</a> -->
    <v-client-table :data="tableData" :columns="columns"></v-client-table>
    <md-button @click.native="download_content">Download</md-button>
  </div>
</template>

<script>
  import download from 'downloadjs'
  import json2csv from 'json2csv'
  import pick from 'lodash.pick'
  import Translations from '@/lib/translations'
  import {elements_array}from '@/lib/form_helpers'

  export default {
    props: ['responses', 'denominator'],
    data() {
      return {
        loaded: false,
        tableData: null,
        columns: null
      }
    },
    computed: {
      instance_config() {
        return this.$store.state.instance_config
      }
    },
    watch: {
      'responses': 'load_data',
    },
    methods: {
      load_data(){
        // console.log(this.responses)

        const instance_translations = new Translations[this.instance_config.slug](this.instance_config) // TODO: @refac Improve signature, remove duplication

        const data = instance_translations.getTableData(this.responses, this.denominator)

        this.columns = Object.keys(data[0])
        this.tableData = data
        this.loaded = true

        // let columns = Object.keys(aggregations)
        // let data = columns.map((aggregation_name) => {
        //   return aggregations[aggregation_name](this.responses)
        // })

        // this.columns = this.component_config.columns

        // const data = new Aggregator({
        //   responses: this.responses,
        //   denominator: this.denominator,
        //   instance_config: this.$store.state.instance_config
        // })


        // this.tableData = data.map(row => {
        //   return pick(row, this.columns)
        // })


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
