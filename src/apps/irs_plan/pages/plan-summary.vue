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
  import {mapState} from 'vuex'

  export default {
    name: 'plan_summary',
    props: ['plan', 'edit'],
    computed: {
      ...mapState({
        selected_target_area_ids: state => state.irs_plan.selected_target_area_ids,
        cached_target_areas: state => state.cache.target_areas,
        field_name: state => state.instance_config.spatial_hierarchy[0].field_name,
      }),
      selected_regions() {
        if(this.cached_target_areas) {
          return this.$store.state.irs_plan.selected_target_area_ids.map(id => {
             return this.cached_target_areas.features.find(feature => feature.properties[this.field_name] === id)
          })
        } else {
          return []
        }
      },
      table() {
        const data = this.selected_regions.map(r => r.properties)
        const columns = Object.keys(data[0])
        return {data, columns}
      },
    },
    watch: {selected_regions: () => console.log('changed selected_regions', this.selected_regions)},
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
