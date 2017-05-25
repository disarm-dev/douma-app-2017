<template>
  <div class='container'>
    <h1>IRS Record</h1>
    <md-button class='md-raised' @click.native='$router.push("/irs/record_point/new")'><md-icon>create</md-icon>Add new</md-button>
    <md-button class="md-raised md-warn" :disabled="syncing || unsynced_count === 0" @click.native="sync">
      Sync {{unsynced_count}} records
    </md-button>
    <ul>
      <li v-for='record in records' :index='record'>
        <router-link v-if='!record.synced' :to="{name: 'irs_record_point:edit', params: {record_id: record.id}}">{{format_datetime(record.recorded_on)}} - {{record.synced ? 'synced' : 'unsynced'}}</router-link>
        <p v-else>{{format_datetime(record.recorded_on)}} - {{record.synced ? 'synced' : 'unsynced'}}</p>
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
        records: state => state.irs_record_point.records.sort((a, b) => new Date(b.recorded_on) - new Date(a.recorded_on)),
        unsynced_count: state => state.irs_record_point.records.filter(r => !r.synced).length
      })
    },
    methods: {
      format_datetime(date) {
        return moment(date).format('hh:mm a DD MMM YYYY')
      },
      sync() {
        this.syncing = true
        Promise.all(
          this.records.filter(r => r.synced === false).map((record) => {
            return fetch(`https://disarm-platform.firebaseio.com/records/${record.id}.json`, {
              method: 'PUT',
              body: JSON.stringify(record)
            }).then(() => {
              record.synced = true
              this.$store.commit('irs_record_point/update_record', record)
            })
          })
        ).then(() => this.syncing = false)
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
