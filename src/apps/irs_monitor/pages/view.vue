<template>
  <div>
    <h1>DASHBOARD: {{country}}</h1>
    <div class='container'>
      
      <md-card class="card" >
        <md-card-content>
          <div><h1>Filters</h1></div>
        </md-card-content>
      </md-card>
  
      <template v-for="{name, width_constraint, height_constraint} in components" >
        <md-card class="card" :ref="name" :class="{'card-half-width': width_constraint == 'half'}">
          <md-card-content>
            <component :is="name" :height="window_height"></component>
          </md-card-content>
        </md-card>
      </template>

    </div>
  </div>
</template>

<script>
  import numeral from 'numeral'
  import Translations from '@/lib/translations'
  import basic_chart from '@/components/irs_monitor/basic_chart'
  import line_chart from '@/components/irs_monitor/line_chart'

  // import {SWZ} from 'swz.components/index.js'
  // SWZ
  import pop_covered_swz_chart from '@/components/irs_monitor/pop_covered_swz_chart'
  import structures_sprayed_swz_chart from '@/components/irs_monitor/structures_sprayed_swz_chart'
  import locked_vs_sprayed_swz_chart from '@/components/irs_monitor/locked_vs_sprayed_swz_chart'
  import pop_covered_vs_structures_swz_chart from '@/components/irs_monitor/pop_covered_vs_structures_swz_chart'
  import structures_pr_supervisor_swz_chart from '@/components/irs_monitor/structures_pr_supervisor_swz_chart'
  import swz_map from '@/components/irs_monitor/swz_map'

  // NAM
  import structures_sprayed_nam_doughnut from '@/components/irs_monitor/structures_sprayed_nam_doughnut'
  import nam_map from '@/components/irs_monitor/nam_map'
  import nam_table from '@/components/irs_monitor/nam_table'

  // BWA
  import prop_room_sprayed_bwa_chart from '@/components/irs_monitor/prop_room_sprayed_bwa_chart'
  import prop_people_covered_bwa_chart from '@/components/irs_monitor/prop_people_covered_bwa_chart'
  import refusal_bwa_pie from '@/components/irs_monitor/refusal_bwa_pie'
  import bwa_map from '@/components/irs_monitor/bwa_map'


  export default {
    name: 'DashboardNotDashboard',
    components: {
      basic_chart, 
      line_chart, 

      // SWZ
      pop_covered_swz_chart,
      structures_sprayed_swz_chart,
      locked_vs_sprayed_swz_chart,
      pop_covered_vs_structures_swz_chart,
      structures_pr_supervisor_swz_chart,
      swz_map,

      // NAM
      structures_sprayed_nam_doughnut,
      nam_map,
      nam_table,

      // BWA
      prop_room_sprayed_bwa_chart,
      prop_people_covered_bwa_chart,
      refusal_bwa_pie,
      bwa_map

    },
    filters: {
      two_decimals(value) {
        return numeral(value).format('0.[00]')
      }
    },
    data () {
      return {
        t: {}, // TRANSLATIONS,
        denominator: 123,
        _components: []
      }
    },
    created() {
      this.add_translations()
    },
    mounted() {
      console.warn("IRS Monitor: Loaded SEED data for debugging")
    },
    computed: {
      window_height() {
        return (window.innerHeight - document.querySelector('.md-toolbar').clientHeight) - 200
      },
      slug() {
        return this.$store.state.instance_config.slug
      },
      country() {
        return this.$store.state.instance_config.name
      },
      components() {
        return this.$store.state.instance_config.applets.irs_monitor.components
      }
    },
    methods: {
      add_translations() {
        const Translator = Translations[this.slug.toLowerCase()]
        const options = {
          targeted_count: this.fake_denominator
        }
        const responses = this.$store.state.irs_monitor.responses
        const translations = new Translator({responses, options})
        this.t = translations
      }
    }
  }
</script>

<style scoped>
  .container {
    margin: 1em auto;
    width: 90%;
  }

  .card {
    display: inline-block;
    margin: 2.5%; 
    padding: 1em;
    flex: 1;
    width: 95%;
  }

  .card-half-width {
    width: 45%;
  }
  .card {
    /*margin: 1em auto;*/
    height: 70px
  }
</style>
