<template>
  <div>
    <h3>Selected regions:</h3>
    <md-button class='md-raised md-warn'>Clear plan</md-button>
    <md-button class='md-raised md-primary' @click.native="download_plan">Download plan</md-button>
    <p>Working with {{selected_target_area_ids.length}} regions, containing in total XX structures, YY rooms, ZZ population</p>
    <v-client-table
      v-if="all_target_areas"
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
    props: ['plan', 'edit'],
    data() {
      return {
        all_target_areas: null
      }
    },
    computed: {
      ...mapState({
        slug: state => state.instance_config.slug.toLowerCase(),
        denominator: state => state.instance_config.denominator,
        selected_target_area_ids: state => state.irs_plan.selected_target_area_ids,
        field_name: state => state.instance_config.spatial_hierarchy[0].field_name,
      }),
      table() {
        if (this.all_target_areas) {
          const selected_areas = this.selected_target_area_ids.map(id => {
            return this.all_target_areas.features.find(feature => feature.properties[this.field_name] === id)
          })
          const data = selected_areas.map(r => r.properties)
          const columns = Object.keys(data[0])
          return {data, columns}
        }
      },
    },
    mounted() {
      this.fetch_target_areas_json().then(geojson => {
        this.all_target_areas = geojson
      })
    },
    methods: {
      fetch_target_areas_json() {
        return fetch(`/static/api_testing/${this.slug}/spatial_hierarchy/${this.slug}.${this.denominator.aggregate_to}.geojson`)
          .then(res => res.json())
      },
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
