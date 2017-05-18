<template>
  <md-layout md-gutter>
    <md-layout md-column md-gutter>
      <md-layout md-flex="20"></md-layout>
      <md-layout></md-layout>
    </md-layout>

    <md-layout md-column md-gutter>
      <md-layout md-flex="50"></md-layout>
      <md-layout></md-layout>
      <md-layout></md-layout>
    </md-layout>
  </md-layout>
  <!--<md-layout class="container"md-gutter>-->
    <!--&lt;!&ndash;<h1>DASHBOARD: {{country}}</h1>&ndash;&gt;-->
    <!--<md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">-->
      <!--<md-card class="card">-->
        <!--<md-card-content>-->
          <!--{{t.responses_count()}} responses recorded-->
        <!--</md-card-content>-->
      <!--</md-card>-->
    <!--</md-layout>-->
    <!--<md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">-->
      <!--<md-card class="card">-->
        <!--<md-card-content>-->
          <!--{{t.sprayed_over_visited() | two_decimals }}% sprayed_over_visited-->
        <!--</md-card-content>-->
      <!--</md-card>-->
    <!--</md-layout>-->
    <!--<md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">-->

      <!--<md-card class="card">-->
        <!--<md-card-content>-->
          <!--{{t.sprayed_count()}} rooms sprayed-->
        <!--</md-card-content>-->
      <!--</md-card>-->
    <!--</md-layout>-->
    <!--<md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">-->

      <!--<md-card class="card">-->
        <!--<md-card-content>-->
          <!--{{t.unsprayed_count()}} bedrooms not sprayed-->
        <!--</md-card-content>-->
      <!--</md-card>-->
    <!--</md-layout>-->
    <!--<md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">-->
      <!--<md-card class="card">-->
        <!--<md-card-content>-->
          <!--{{t.sprayed_over_targeted() | two_decimals }}% sprayed_over_targeted (using fake_denominator: {{fake_denominator}})-->
        <!--</md-card-content>-->
      <!--</md-card>-->
    <!--</md-layout>-->
    <!--<md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">-->
      <!--<md-card class="card">-->
        <!--<md-card-content>-->
          <!--Burn rate: SOME-->
        <!--</md-card-content>-->
      <!--</md-card>-->
    <!--</md-layout>-->
    <!--<md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">-->
      <!--<md-card class="card">-->
        <!--<md-card-content>-->
          <!--<basic_chart></basic_chart>-->
        <!--</md-card-content>-->
      <!--</md-card>-->
    <!--</md-layout>-->

  <!--</md-layout>-->

</template>

<script>
  import numeral from 'numeral'
  import Translations from '@/lib/translations'
  import basic_chart from '@/components/basic_chart'
  import seed_responses from '@/seed_responses.json'

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
        t: {}, // DATA TRANSLATIONS,
        fake_denominator: 123
      }
    },
    created() {
      this.add_translations()
    },
    mounted() {
      console.warn("IRS Monitor: Loaded SEED data for debugging")
    },
    computed: {
      slug() {
        return this.$store.state.instance_config.slug
      },
      country() {
        return this.$store.state.instance_config.name
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
    margin: 10px;
  }
  .card {
    /*margin: 1em auto;*/
    height: 70px
  }
</style>
