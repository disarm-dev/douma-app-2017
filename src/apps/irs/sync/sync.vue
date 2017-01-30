<template>
  <div class="sync">
    <div class='md-title'>Sync</div>
    <div>There are {{recordsCount}} records, and {{unsyncedCount}} records not synced</div>
    <div class='md-body-1'>Synchronise your data with the server.</div>
    <br>
    <div v-if="!$store.state.online" class='md-body-1'>You need to be connected to the internet to synchronise. </div>
    <md-button @click="sync" :disabled="!$store.state.online" >Sync</md-button>
    <md-button @click='deleteActions' class='md-button md-raised md-warn'>Delete all Actions</md-button>
    <md-progress v-show='$store.state.irs.syncInProgress' md-indeterminate></md-progress>
  </div>
</template>

<script>
  export default {
    mounted() {
        // actions.list().then( (res) => {
        //   // TODO: @refac Can remove `Actions` from $store (check `sync.vue` first)
        //   this.$store.state.irs.actions = res.data
        // })
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
        this.$store.dispatch('irs:sync')
      },
      deleteActions() {
        this.$store.dispatch('irs:deleteAllActions')
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