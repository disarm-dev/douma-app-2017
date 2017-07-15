<template>
  <controls>
    <md-button slot="primary_action" class="md-icon-button md-raised md-primary" :disabled="isLoading('irs_monitor/refresh_data')" @click.native='refresh_data'>
      <md-icon>refresh</md-icon>
    </md-button>

    <template slot="menu_items">
      <md-menu-item :disabled="isLoading('irs_monitor/refresh_data') || !filtered_responses.length" @click="download_responses">
        <md-icon>file_download</md-icon>
        <span>Download responses</span>
      </md-menu-item>
    </template>

    <div slot="text">
      {{filtered_responses.length}} record{{filtered_responses.length === 1 ? '' : 's' }} lie within the planned areas.
      Last updated: {{responses_last_updated_at}}
    </div>
  </controls>

</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import moment from 'moment'
  import download from 'downloadjs'
  import json2csv from 'json2csv'

  import controls from 'components/controls.vue'

  export default {
    name: 'summary',
    components: {controls},
    mounted() {
    },
    data() {
      return {}
    },
    computed: {
      ...mapState({
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
        isLoading: 'loading/isLoading'
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
