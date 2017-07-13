<template>
  <div class="controls">
    <md-button class="md-icon-button md-raised md-primary" :disabled="loading" @click.native='refresh_data'>
      <md-icon>refresh</md-icon>
    </md-button>

    <!-- MENU -->
    <md-menu md-direction="bottom right" md-size="6">
      <md-button class="md-icon-button md-raised" md-menu-trigger>
        <md-icon>more_vert</md-icon>
      </md-button>

      <md-menu-content>
        <md-menu-item :disabled="loading || !filtered_responses.length" @click="download_responses">
          <md-icon>file_download</md-icon>
          <span>Download responses</span>
        </md-menu-item>

      </md-menu-content>
    </md-menu>

    <div>
      {{filtered_responses.length}} record{{filtered_responses.length === 1 ? '' : 's' }} lie within the planned areas.
      Last updated: {{responses_last_updated_at}}
    </div>

    <div v-if='!plan' style="color: red">Plan missing - no calculations until one is loaded</div>

  </div>


</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import moment from 'moment'
  import download from 'downloadjs'
  import json2csv from 'json2csv'

  export default {
    name: 'summary',
    mounted() {
    },
    data() {
      return {}
    },
    computed: {
      ...mapState({
        loading: state => state.loading,
        plan: state => state.irs_monitor.plan,
        instance_config: state => state.instance_config,
        responses_last_updated_at: state => {
          if (state.irs_monitor.responses_last_updated_at) {
            return moment(state.irs_monitor.responses_last_updated_at).format("dddd, MMMM Do YYYY, h:mm:ss a")
          } else {
            return "not yet updated"
          }
        }
      }),
      ...mapGetters({
        filtered_responses: 'irs_monitor/filtered_responses',
      })
    },
    mounted() {
      if (!this.plan) {
        this.$nextTick(() => this.$store.commit('root:set_snackbar', {message: "Plan missing - refresh data to load"}))
      }
    },
    methods: {
      refresh_data() {
        this.$emit('refresh_data')
      },
      download_responses() {
        if(!this.filtered_responses.length) return

        const fields = Object.keys(this.filtered_responses[0])
        const data = this.filtered_responses
        const content = json2csv({data, fields})

        const date = moment().format('YYYY-MM-DD_HHmm')
        download(content, `${this.instance_config.instance.slug}_responses_${date}.csv`)
        this.$ga.event('irs_monitor','click_download_responses')
      }
    }
  }
</script>

<style scoped>
</style>
