<template>
  <div>
    <router-link class='md-button md-raised' to='/irs/record_point'><md-icon>create</md-icon>Add new</router-link>
    <md-button class="md-raised md-primary" :disabled="syncing" @click.native="sync">
      Sync
    </md-button>
    <ul>
      <li v-for='response in responses' :index='response'>
        <router-link :to="{name: 'irs_record_point:edit', params: {response_id: response.id}}">{{response.id}} {{response.synced ? 'synced' : 'unsynced'}}</router-link>
      </li>
    </ul> 
  </div>
</template>

<script>
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
        responses: state => state.irs_record_point.responses
      })
    },
    methods: {
      sync() {
        this.syncing = true
        Promise.all(
          this.responses.map((response) => {
            return fetch(`https://disarm-platform.firebaseio.com/responses/${response.id}.json`, {
              method: 'PUT',
              body: JSON.stringify(response)
            }).then(() => {
              this.$store.commit('irs_record_point/delete_response', response)
            })
          })
        ).then(() => this.syncing = false)
      }
    }
  }
</script>

<style lang="css" scoped>
</style>