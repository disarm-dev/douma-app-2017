<template>
  <div class='container'>
    <!-- <local_record_summary></local_record_summary> -->
    <div v-if="!online">Offline - unable to sync</div>
    <md-button class='md-raised md-primary' @click.native='$router.push("/irs/record_point/new")'><md-icon>create</md-icon>Add new</md-button>
    <md-button class="md-raised md-warn" :disabled="syncing || unsynced_count === 0 || !online" @click.native="sync">
      Sync {{unsynced_count}} responses
    </md-button>
    <md-button class="md-raised md-warn" :disabled="syncing || synced_count === 0" @click.native="clear_synced_responses">
      Hide synced responses
    </md-button>

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
        responses: state => state.irs_record_point.responses.sort((a, b) => new Date(b.recorded_on) - new Date(a.recorded_on)),
        unsynced_count: state => state.irs_record_point.responses.filter(r => !r.synced).length,
        synced_count: state => state.irs_record_point.responses.filter(r => r.synced).length,
        online: state => state.network_online
      })
    },
    methods: {
      format_response(response) {
        const location_name = response.location_selection.name
//        const date = this.format_datetime(response.recorded_on)
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

        let responses_to_sync = this.responses.filter(r => !r.synced)

        this.$store.dispatch('irs_record_point/create_records', responses_to_sync)
          .then(() => {
            responses_to_sync.forEach((response) => {
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
      }
    }
  }
</script>
