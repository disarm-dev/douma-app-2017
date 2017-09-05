<template>
  <div>
    <h3>Selected regions:</h3>
    <md-button class='md-raised md-primary' @click.native="download_plan">Download plan</md-button>
    <v-client-table
      v-if="selected_target_area_ids.length !== 0"
      :data="table.data"
      :columns="table.columns"
    ></v-client-table>
  </div>
</template>

<script>
  import download from 'downloadjs'
  import json2csv from 'json2csv'
  import moment from 'moment-mini'
  import {mapState, mapGetters} from 'vuex'

  import cache from 'config/cache.js'
  import {get_planning_level_name} from 'lib/instance_data/spatial_hierarchy_helper'

  export default {
    name: 'plan_summary',
    props: ['edit'],
    data() {
      return {
        calculator: {
          enumerables: 40,
          teams: 20
        },
      }
    },
    computed: {
      ...mapState({
        slug: state => state.instance_config.instance.slug
      }),
      ...mapGetters({
        selected_target_area_ids: 'irs_plan/all_selected_area_ids'
      }),
      planning_level_name() {
        return get_planning_level_name()
      },
      selected_areas() {
        return cache.geodata[this.planning_level_name].features.filter(feature => {
          return this.selected_target_area_ids.includes(feature.properties.__disarm_geo_id)
        })
      },
      table() {
        const data = this.selected_areas.map(r => r.properties)
        const columns = Object.keys(data[0])
        return {data, columns}
      },
    },
    methods: {
      download_plan() {
        const data = this.table.data
        const fields = this.table.columns
        const content = json2csv({data, fields})
        const date = moment().format('YYYY-MM-DD_HHmm')

        download(content, `${this.slug}_irs_plan_${date}.csv`)
        this.$ga.event('irs_plan','click_download_plan')
      }
    }
  }
</script>
