<template>
  <div class='container'>
    <h1>DASHBOARD: {{country}}</h1>
    <md-card style="margin: 1em 0;">
      <md-card-content>
        {{t.responses_count()}} responses recorded
      </md-card-content>
    </md-card>
    <md-card style="margin: 1em 0;">
      <md-card-content>
        {{t.sprayed_over_visited() | two_decimals }}% sprayed_over_visited
      </md-card-content>
    </md-card>

    <md-card style="margin: 1em 0;">
      <md-card-content>
        {{t.sprayed_count()}} rooms sprayed
      </md-card-content>
    </md-card>

    <md-card style="margin: 1em 0;">
      <md-card-content>
        {{t.unsprayed_count()}} bedrooms not sprayed
      </md-card-content>
    </md-card>
    <md-card style="margin: 1em 0;">
      <md-card-content>
        {{t.sprayed_over_targeted() | two_decimals }}% sprayed_over_targeted (using denominator: {{denominator}})
      </md-card-content>
    </md-card>
    <md-card style="margin: 1em 0;">
      <md-card-content>
        <basic_chart></basic_chart>
      </md-card-content>
    </md-card>
  </div>

</template>

<script>
  import numeral from 'numeral'
  import Translations from '@/lib/translations'
  import basic_chart from '@/components/basic_chart'

  export default {
    name: 'view',
    components: {basic_chart},
    filters: {
      two_decimals(value) {
        return numeral(value).format('0.[00]')
      }
    },
    data () {
      return {
        t: {}, // TRANSLATIONS,
        denominator: 123
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
      }
    }
  }
</script>

<style scoped>
  .container {
    margin: 10px;
  }
</style>
