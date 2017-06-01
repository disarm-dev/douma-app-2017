<template>
  <div>
    <h3>Selected regions:</h3>
    <md-button class='md-raised md-warn'>Clear plan</md-button>
    <md-button class='md-raised md-primary' @click.native="download_plan">Download plan</md-button>
    <p>Working with {{selected_target_area_ids.length}} regions, containing in total XX structures, YY rooms, ZZ population</p>
    <!--<v-client-table-->
      <!--v-if="table.data.length > 0"-->
      <!--:data="table.data"-->
      <!--:columns="table.columns"-->
    <!--&gt;</v-client-table>-->
  </div>

</template>

<script>
  import download from 'downloadjs'
  import json2csv from 'json2csv'
  import moment from 'moment'

  export default {
    name: 'plan_summary',
    props: ['plan', 'edit'],
    computed: {
      selected_target_area_ids() {
        return this.$store.state.irs_plan.selected_target_area_ids
      },
//      selected_regions() {
//        return this.$store.state.irs_plan.selected_target_area_ids.map(id => {
//          // return this.regions.find(feature => feature.properties.id === id)
//        })
//      },
//      table() {
//        const data = this.plan.map(r => r.properties)
//        const columns = Object.keys(data[0])
//        return {data, columns}
//      },
    },
    methods: {
      download_plan() {
        const data = this.tableData
        const fields = this.tableColumns
        const content = json2csv({data, fields})
        const date = moment().format('YYYY-MM-DD_HHmm')

        download(content, `${this.slug}_irs_plan_${date}.csv`)
      }
    }
  }
</script>

<style></style>
