<template>
  <div>
    <router-link class='md-button md-raised' to='/irs/record_point'><md-icon>create</md-icon>Add new</router-link>
    <md-button class="md-raised md-primary" @click.native="sync">
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
      }
    },
    computed: {
      ...mapState({
        responses: state => state.irs_record_point.responses
      })
    },
    methods: {
      sync() {
        this.responses
          .filter((response) => (
            !response.synced
          ))
          .map((response) => {
            fetch(`https://disarm-platform.firebaseio.com/responses/${response.id}.json`, {
              method: 'PUT',
              body: JSON.stringify(response)
            }).then(() => {
              response.synced = true
              this.$store.commit('irs_record_point/update_response', response)
            })
          })
      }
    }
  }
</script>

<style lang="css" scoped>
</style>