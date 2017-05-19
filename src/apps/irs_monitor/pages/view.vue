<template>
  <div>
    <h1>DASHBOARD: {{country}}</h1>
    <div class='container'>

      <template v-for="component in components">
        <md-card class="card">
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

  // NAM
  import structures_sprayed_nam_doughnut from '@/components/structures_sprayed_nam_doughnut'

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

      // NAM
      structures_sprayed_nam_doughnut

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
    flex-basis: 45%;
  }
</style>
