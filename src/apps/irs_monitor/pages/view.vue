<template>
  <div>
    <h1>DASHBOARD: {{country}}</h1>
    <div class='container'>

      <template v-for="component in components">
        <md-card class="card" :ref="component" @click.native="toggle_enlarge(component)" style="flex-basis: 45%">
          <md-card-content>
            <div :is="component"></div>
          </md-card-content>
        </md-card>
      </template>

    </div>
  </div>
</template>

<script>
  import numeral from 'numeral'
  import Translations from '@/lib/translations'
  import basic_chart from '@/components/basic_chart'
  import line_chart from '@/components/line_chart'
  // SWZ
  import pop_covered_swz_chart from '@/components/pop_covered_swz_chart'
  import structures_sprayed_swz_chart from '@/components/structures_sprayed_swz_chart'
  import locked_vs_sprayed_swz_chart from '@/components/locked_vs_sprayed_swz_chart'
  import pop_covered_vs_structures_swz_chart from '@/components/pop_covered_vs_structures_swz_chart'
  import structures_pr_supervisor_swz_chart from '@/components/structures_pr_supervisor_swz_chart'
  import swz_map from '@/components/swz_map'

  // NAM
  import structures_sprayed_nam_doughnut from '@/components/structures_sprayed_nam_doughnut'
  import nam_map from '@/components/nam_map'

  // BWA
  import prop_room_sprayed_bwa_chart from '@/components/prop_room_sprayed_bwa_chart'
  import prop_people_covered_bwa_chart from '@/components/prop_people_covered_bwa_chart'
  import refusal_bwa_pie from '@/components/refusal_bwa_pie'
  import bwa_map from '@/components/bwa_map'


  export default {
    name: 'view',
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
      const Translator = Translations[this.slug.toLowerCase()]
      const options = {
        targeted: this.denominator
      }
      const responses = this.$store.state.irs_monitor.responses
      const translations = new Translator({responses, options})
      this.t = translations
    },
    computed: {
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
      toggle_enlarge(component) {
        const element = this.$refs[component][0].$el
        let current = element.style['flex-basis']
        if (current == '45%') {
          element.style['flex-basis'] = '95%'
        } else {
          element.style['flex-basis'] = '45%'
        }
      }
    }
  }
</script>

<style scoped>
  .container {
    margin: 1em auto;
    max-width: 1200px;
    display: flex;
    flex-wrap: wrap;
  }

  .card {
    margin: 2.5%; 
    padding: 1em;
    flex: 1;
    /*flex-basis: 45%;*/
  }
</style>
