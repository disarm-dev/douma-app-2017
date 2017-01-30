<template>
  <div class="sync">
    <div class='md-title'>Sync</div>
    <div>There are {{recordsCount}} records, and {{unsyncedCount}} records not synced</div>
    <div class='md-body-1'>Synchronise your data with the server.</div>
    <br>
    <div v-if="!$store.state.online" class='md-body-1'>You need to be connected to the internet to synchronise. </div>
    <md-button v-if="syncing.length === 0" :disabled="!$store.state.online" @click="sync">Sync</md-button>
    <div v-if="syncing.length > 0">
      <div class='md-title'>Syncing...</div>
    </div>
    <md-button @click='deleteActions()' class='md-button md-raised md-warn'>Delete all Actions</md-button>
  </div>
</template>
<script>
  import {structures, actions, syncOptions} from '../../../db'
  import Vue from 'vue'

  export default {
    data() {
      return {
        syncing: []
      }
    },
    mounted() {
        actions.list().then( (res) => {
          // TODO: @refac Can remove `Actions` from $store (check `sync.vue` first)
          this.$store.state.irs.actions = res.data
        })
    },
    computed: {
      recordsCount() {
        return this.$store.state.irs.actions.length
      },
      unsyncedCount() {
        return this.$store.state.irs.actions.filter( (i) => i._status == "created").length
      }
    },
    methods: {
      sync() {
        actions.sync(syncOptions).then(r => {
          console.log(r)
          actions.list().then( (res) => this.$store.state.irs.actions = res.data )
        }) 
      },
      deleteActions() {
        actions.list().then((res) => {
          console.log(res.data)
          return Promise.all(res.data.map((action) => {
            return actions.delete(action.id)
          }))
        })
      }
    }
  }
</script>
<style scoped>
  .sync {
    max-width: 800px;
    margin: 1em auto;
    padding: 1em;
  }
</style>