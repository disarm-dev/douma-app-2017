<template>
  <div>
    <router-link class='md-button md-raised' to='/irs/record_point'><md-icon>create</md-icon>Add new</router-link>
    <md-button class="md-raised md-primary" :disabled="syncing" @click.native="sync">
      Sync
    </md-button>
    <ul>
      <li v-for='response in responses' :index='response'>
        <router-link :to="{name: 'irs_record_point:edit', params: {response_id: response.id}}">{{format_datetime(response.recorded_on)}} - {{response.synced ? 'synced' : 'unsynced'}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import moment from 'moment'
  import {mapState} from 'vuex'
  export default {
    name: 'review',
    data () {
      return {
        syncing: false
      }
    },
    computed: {
      ...mapState({
        responses: state => state.irs_record_point.responses.sort((a, b) => new Date(a.recorded_on) - new Date(b.recorded_on))
      })
    },
    methods: {
      format_datetime(date) {
        return moment(date).format('hh:mm a DD MMM YYYY')
      },
      sync() {
        this.syncing = true
        Promise.all(
          this.responses.filter(r => r.synced === false).map((response) => {
            return fetch(`https://disarm-platform.firebaseio.com/responses/${response.id}.json`, {
              method: 'PUT',
              body: JSON.stringify(response)
            }).then(() => {
              response.synced = true
              this.$store.commit('irs_record_point/update_response', response)
            })
          })
        ).then(() => this.syncing = false)
      }
    }
  }
</script>

<style lang="css" scoped>
</style>
