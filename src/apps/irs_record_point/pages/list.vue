<template>
  <div class='container'>
    <h1>IRS Record</h1>
    <div v-if="!online">Offline - unable to sync</div>
    <md-button class='md-raised' @click.native='$router.push("/irs/record_point/new")'><md-icon>create</md-icon>Add new</md-button>
    <md-button class="md-raised md-warn" :disabled="syncing || unsynced_count === 0 || !online" @click.native="sync">
      Sync {{unsynced_count}} responses
    </md-button>
    <ul>
      <li v-for='response in responses' :index='response'>
        <router-link v-if='!response.synced' :to="{name: 'irs_record_point:edit', params: {response_id: response.id}}">{{format_datetime(response.recorded_on)}} - {{response.synced ? 'synced' : 'unsynced'}}</router-link>
        <p v-else>{{format_datetime(response.recorded_on)}} - {{response.synced ? 'synced' : 'unsynced'}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
  import moment from 'moment'
  import {mapState} from 'vuex'
  export default {
    name: 'List',
    data () {
      return {
        syncing: false
      }
    },
    computed: {
      ...mapState({
        responses: state => state.irs_record_point.responses.sort((a, b) => new Date(b.recorded_on) - new Date(a.recorded_on)),
        unsynced_count: state => state.irs_record_point.responses.filter(r => !r.synced).length,
        online: state => state.network_online
      })
    },
    methods: {
      format_datetime(date) {
        return moment(date).format('hh:mm a DD MMM YYYY')
      },
      sync() {
        this.$store.commit('root:set_loading', true)
        this.syncing = true
        Promise.all(

          this.responses.filter(r => r.synced === false).map((response) => {
            return this.$store.dispatch('irs_record_point/create_record', response).then((res) => {
              response.synced = true
              this.$store.commit('irs_record_point/update_response', response)
            })
          })
        )
        .then(() => {
          this.syncing = false
          this.$store.commit('root:set_loading', false)
          this.$store.commit('root:set_snackbar', {message: 'Successfully synced responses'})
        })
        .catch(() => this.$store.commit('root:set_loading', false))
      }
    }
  }
</script>

<style lang="css" scoped>
  .container {
    margin: 0 auto;
    width: 90%;
  }
</style>
