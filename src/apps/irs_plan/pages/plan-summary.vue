<template>
  <div>
    <h3>Selected regions:</h3>
    <md-button class='md-raised md-warn'>Clear plan</md-button>
    <md-button class='md-raised md-primary' @click.native="download_plan">Download plan</md-button>
    <p>Working with {{selected_target_area_ids.length}} regions, containing in total XX structures, YY rooms, ZZ population</p>
    <v-client-table
      v-if="geodata.all_target_areas && selected_target_area_ids.length !== 0"
      :data="table.data"
      :columns="table.columns"
    ></v-client-table>
  </div>

</template>

<script>
  import download from 'downloadjs'
  import json2csv from 'json2csv'
  import moment from 'moment'
  import {mapState} from 'vuex'

  export default {
    name: 'plan_summary',
    props: ['plan', 'edit', 'geodata'],
    computed: {
      ...mapState({
        slug: state => state.instance_config.slug.toLowerCase(),
        denominator: state => state.instance_config.denominator,
        selected_target_area_ids: state => state.irs_plan.selected_target_area_ids,
        field_name: state => state.instance_config.spatial_hierarchy[0].field_name,
      }),
      table() {
        if (this.geodata.all_target_areas) {
          const selected_areas = this.selected_target_area_ids.map(id => {
            return this.geodata.all_target_areas.features.find(feature => feature.properties[this.field_name] === id)
          })
          const data = selected_areas.map(r => r.properties)
          const columns = Object.keys(data[0])
          return {data, columns}
        }
      },
    },
    methods: {
      download_plan() {
        const data = this.table.data
        const fields = this.table.columns
        const content = json2csv({data, fields})
        const date = moment().format('YYYY-MM-DD_HHmm')

        download(content, `${this.slug}_irs_plan_${date}.csv`)
      }
    }
  }
</script>

<style></style>
