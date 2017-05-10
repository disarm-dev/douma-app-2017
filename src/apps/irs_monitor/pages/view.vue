<template>
  <div class='container'>
    <h1>DASHBOARD: {{country}}</h1>
    <md-card style="margin: 1em 0;">
      <md-card-content>
        {{responses_count}} responses recorded
      </md-card-content>
    </md-card>
    <md-card style="margin: 1em 0;">
      <md-card-content>
        {{spray_progress}} responses recorded
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
  import Translations from '@/lib/translations'
  import basic_chart from '@/components/basic_chart'

  export default {
    name: 'view',
    components: {basic_chart},
    data () {
      return {
        _translator: {}
      }
    },
    created() {
      this._translator = new Translations[this.slug.toLowerCase()]
    },
    computed: {
      slug() {
        return this.$store.state.instance_config.slug
      },
      country() {
        return this.$store.state.instance_config.name
      },
      responses() {
        return this.$store.state.irs_monitor.responses
      },
      responses_count() {
        return this._translator.responses_count(this.responses)
      },
      spray_progress() {
        return '50%'
      }
    }
  }
</script>

<style scoped>
  .container {
    margin: 10px;
  }
</style>