<template>
  <div>
    <h3>Calculator</h3>
    <div>
      At a rate of <input class="slim-input" type="number" v-model="calculator.enumerables"/> {{enumerable_name}} per team per day, with  <input class="slim-input" type="number" v-model="calculator.teams"/> teams this would take {{days_to_spray}} days
    </div>

    <h3>Selected regions:</h3>
    <md-button class='md-raised md-primary' @click.native="download_plan">Download plan</md-button>
    <p>Working with {{selected_target_area_ids.length}} {{planning_level_name}}, containing in total {{number_of_structures}} {{enumerable_name}}</p>
    <v-client-table
      v-if="geodata_ready && selected_target_area_ids.length !== 0"
      :data="table.data"
      :columns="table.columns"
    ></v-client-table>
  </div>
</template>

<script>
  import download from 'downloadjs'
  import json2csv from 'json2csv'
  import moment from 'moment-mini'
  import isNumber from 'is-number'
  import {mapState, mapGetters} from 'vuex'

  import cache from 'config/cache.js'
  import {get_planning_level_id_field, get_denominator_fields, get_planning_level_name} from 'lib/geodata/spatial_hierarchy_helper'

  export default {
    name: 'plan_summary',
    props: ['edit', 'geodata_ready'],
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
        slug: state => state.instance_config.instance.slug,
        instance_config: state => state.instance_config
      }),
      ...mapGetters({
        selected_target_area_ids: 'irs_plan/all_selected_area_ids'
      }),
      structure_field_name() {
        const denominator = get_denominator_fields()
        const field = Object.keys(denominator)[0] // number_of_structures or number_of_households
        return denominator[field] // gets 'NumHouseho' or 'NmStrct'
      },
      planning_level_name() {
        return get_planning_level_name()
      },
      planning_level_id_field() {
        return get_planning_level_id_field()
      },
      selected_areas() {
        return cache.geodata[this.planning_level_name].features.filter(feature => {
          return this.selected_target_area_ids.includes(feature.properties[this.planning_level_id_field])
        })
      },
      table() {
        if (this.geodata_ready) {
          const data = this.selected_areas.map(r => r.properties)
          const columns = Object.keys(data[0])
          return {data, columns}
        }
      },
      days_to_spray() {
        const structures_per_day = this.calculator.enumerables * this.calculator.teams
        return this.number_of_structures / structures_per_day
      },
      number_of_structures() {
        if (this.geodata_ready) {
          return this.selected_areas.reduce((sum, area) => {
            const hope_is_number = area.properties[this.structure_field_name]
            if (isNumber(hope_is_number)) {
              return sum + hope_is_number
            } else {
              return sum
            }
          }, 0)
        }
        return 0
      },
      summary_text() {
        const count = 34
        const enumerable_name = 'structures'
        return `${count} ${enumerable_name}`
      },
      enumerable_name() {
        console.warn("TODO: @fix Wow. This is horrible. 🙈")
        switch (this.$store.state.instance_config.instance.slug) {
          case 'zwe':
            return 'rooms'
          default:
            return 'structures'
        }
      }
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

<style>
  .slim-input {
    width: 60px;
  }
</style>
