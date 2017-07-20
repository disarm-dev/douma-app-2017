<template>
  <div class='applet_container'>
     <!--<local_record_summary></local_record_summary>-->

    <controls>
      <md-button slot="primary_action" class="md-icon-button md-raised md-primary" @click.native='$router.push("/irs/record_point/new")'>
        <md-icon>create</md-icon>
      </md-button>

      <template slot="menu_items">
        <md-menu-item :disabled="syncing || unsynced_count === 0 || !online" @click="sync">
          <md-icon>sync</md-icon>
          <span>Sync {{unsynced_count}} responses</span>
        </md-menu-item>

        <md-menu-item :disabled="syncing || synced_count === 0" @click="clear_synced_responses">
          <md-icon>close</md-icon>
          <span>Hide synced responses</span>
        </md-menu-item>

        <md-menu-item :disabled="syncing || unsynced_count === 0" @click="download_records">
          <md-icon>file_download</md-icon>
          <span>Export {{unsynced_count}} unsynced</span>
        </md-menu-item>

      </template>

      <div v-if="!online" slot="text">
        Offline - unable to sync
      </div>

    </controls>

    <!-- LIST ALL -->
    <md-card>
      <md-card-header>
        <div class="md-title">{{unsynced_count}} responses</div>
      </md-card-header>
      <md-card-content>
        <md-list>
          <virtual_list :size="40" :remain="10">
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
          </virtual_list>
        </md-list>
      </md-card-content>
    </md-card>

  </div>
</template>

<script>
  import virtual_list from 'vue-virtual-scroll-list'
  import download from 'downloadjs'
  import moment from 'moment-mini'
  import flatten from 'lodash.flatten'
  import {mapState} from 'vuex'

  import controls from 'components/controls.vue'
  import local_record_summary from './local_record_summary'

  export default {
    name: 'List',
    components: {controls, virtual_list, local_record_summary},
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
        const location_name = response.location.selection.name
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
        this.$startLoading('irs_record_point/sync')
        this.syncing = true

        this.$store.dispatch('irs_record_point/create_records', this.unsynced_responses)
          .then((results) => {
            console.log('results', results)
            const last_successful_sync_count = flatten(results.pass).length
            this.$endLoading('irs_record_point/sync')
            this.syncing = false
            this.$store.commit('root:set_snackbar', {message: `Successfully synced ${last_successful_sync_count} responses`})
          })
          .catch(() => {
            this.$endLoading('irs_record_point/sync')
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
