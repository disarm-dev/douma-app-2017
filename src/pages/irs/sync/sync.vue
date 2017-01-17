<template>
  <div class="sync">
    <div class='md-title'>Sync</div>
    <div class='md-body-1'>Synchronise your data with the server.</div>
    <br>
    <div v-if="!$store.state.online" class='md-body-1'>You need to be connected to the internet to synchronise. </div>
    <md-button v-if="syncing.length === 0" :disabled="!$store.state.online" @click="sync">Sync</md-button>
    <div v-if="syncing.length > 0">
      <div class='md-title'>Syncing...</div>
    </div>
  </div>
</template>
<script>
  import PouchDB from 'pouchdb'
  const structures = new PouchDB('structures')
  const actions = new PouchDB('actions')

  export default {
    data() {
      return {
        syncing: []
      }
    },
    methods: {
      sync() {
        this.syncing.push({name: 'structures'})
        let strucSync = PouchDB.sync('structures', 'http://localhost:5984/structures')
          .on('complete', (info) => {
            console.log('complete', info)
            let index = this.syncing.findIndex(({name}) => name === 'structures')
            this.syncing.splice(index, 1)
            strucSync.cancel();
          })
          .on('change', (info) => {
            console.log('change', info)
          })
          .on('error', (err) => {
            console.log('error', info)
          });

        this.syncing.push({name: 'actions'})
        let actionSync = PouchDB.sync('actions', 'http://localhost:5984/actions')
          .on('complete', (info) => {
            console.log('complete', info)
            let index = this.syncing.findIndex(({name}) => name === 'actions')
            this.syncing.splice(index, 1)
            actionSync.cancel();
          })
          .on('change', (info) => {
            console.log('change', info)
          })
          .on('error', (err) => {
            console.log('error', info)
          });
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