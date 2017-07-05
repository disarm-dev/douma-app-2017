<template>
  <md-card class="card">
    <md-card-header>
      <div class="md-title">Table and map update with real records</div>
    </md-card-header>

    <md-card-content>
      <span>{{filtered_responses.length}} record{{filtered_responses.length === 1 ? '' : 's' }} lie within the planned areas.</span>
      <span>Last updated: {{responses_last_updated_at}}</span>
    </md-card-content>

    <md-card-actions>
      <md-button class="md-icon-button md-mini md-raised md-primary" @click.native="refresh_data" :disabled="loading"><md-icon>refresh</md-icon></md-button>
      <md-button class="md-icon-button md-mini md-raised md-primary" @click.native="download_responses" :disabled="loading || !filtered_responses.length"><md-icon>file_download</md-icon></md-button>
    </md-card-actions>
  </md-card>
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
        download(content, `${this.instance_config.slug}_responses_${date}.csv`)
        this.$ga.event('irs_monitor','click_download_responses')
      }
    }
  }
</script>

<style scoped>

</style>
