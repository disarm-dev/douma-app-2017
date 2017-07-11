<template>
  <div class='container'>
     <!--<local_record_summary></local_record_summary>-->
    <div v-if="!online">Offline - unable to sync</div>
    <md-button class='md-raised md-primary' @click.native='$router.push("/irs/record_point/new")'><md-icon>create</md-icon>Add new</md-button>
    <md-button class="md-raised md-warn" :disabled="syncing || unsynced_count === 0 || !online" @click.native="sync">
      Sync {{unsynced_count}} responses
    </md-button>
    <md-button class="md-raised md-warn" :disabled="syncing || synced_count === 0" @click.native="clear_synced_responses">
      Hide synced responses
    </md-button>

    <!-- EXPORT RECORDS-->
    <md-button class="md-raised" :disabled="syncing || unsynced_count === 0" @click.native="download_records">
      Export {{unsynced_count}} unsynced
    </md-button>

    <!-- LIST ALL -->
    <md-list>
      <md-list-item
        v-for='response in responses'
        :index='response'
        :class="{'md-primary': !response.synced}"
        :key="response.id"
      >
        <md-icon>
          {{response.synced ? 'check' : 'mode_edit'}}
        </md-icon>

        <div>
          <router-link
            :to="{name: response.synced ? 'irs_record_point:view' : 'irs_record_point:edit', params: {response_id: response.id}}">
            {{format_response(response)}}
          </router-link>
        </div>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
  import download from 'downloadjs'
  import moment from 'moment'
  import {mapState} from 'vuex'

  import local_record_summary from './local_record_summary'

  export default {
    name: 'List',
    components: {local_record_summary},
    data () {
      return {
        syncing: false,
        target_denominator: 0
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        responses: state => state.irs_record_point.responses.sort((a, b) => new Date(b.recorded_on) - new Date(a.recorded_on)),
        unsynced_count: state => state.irs_record_point.responses.filter(r => !r.synced).length,
        synced_count: state => state.irs_record_point.responses.filter(r => r.synced).length,
        online: state => state.network_online
      }),
      unsynced_responses() {
        return this.responses.filter(r => !r.synced)
      }
    },
    methods: {
      format_response(response) {
        const location_name = response.location_selection.name
        const ago = this.format_datetime_from_now(response.recorded_on)

        return `${location_name} - ${ago}`
      },
      format_datetime_from_now(date) {
        return moment(date).fromNow()//format('hh:mm a DD MMM YYYY')
      },
      format_datetime(date) {
        return moment(date).format('hh:mm a DD MMM YYYY')
      },
      sync() {
        this.$store.commit('root:set_loading', true)
        this.syncing = true

        this.$store.dispatch('irs_record_point/create_records', this.unsynced_responses)
          .then(() => {
            this.unsynced_responses.forEach((response) => {
              response.synced = true
              this.$store.commit('irs_record_point/update_response', response)
            })

            this.$store.commit('root:set_loading', false)
            this.syncing = false
            this.$store.commit('root:set_snackbar', {message: 'Successfully synced responses'})
          })
          .catch(() => {
            this.$store.commit('root:set_loading', false)
            this.syncing = false
          })
      },
      clear_synced_responses() {
        this.$store.dispatch('irs_record_point/clear_synced_responses')
      },
      download_records() {
        const content = JSON.stringify(this.unsynced_responses)
        const date = moment().format('YYYY-MM-DD_HHmm')
        const download_success = download(content, `${this.instance_config.instance.slug}_responses_export_${date}.json`)

        if (download_success) {
          this.unsynced_responses.forEach((response) => {
            response.synced = true
            this.$store.commit('irs_record_point/update_response', response)
          })
        }
      }
    }
  }
</script>
