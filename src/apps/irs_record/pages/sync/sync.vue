<template>
  <div class="sync">
    <div class='md-title'>Sync</div>
    <div>There are {{recordsCount}} tasks, and {{unsyncedCount}} tasks not synced</div>
    <div class='md-body-1'>Synchronise your data with the server.</div>
    <br>
    <div v-if="!$store.state.online" class='md-body-1'>You need to be connected to the internet to synchronise. </div>
    <md-button @click.native="sync" :disabled="!$store.state.online" >Sync and set tasks</md-button>
    <md-button @click.native='deleteTasks' class='md-button md-raised md-warn'>Delete all Tasks</md-button>
    <md-progress v-show='$store.state.irs_record.syncInProgress' md-indeterminate></md-progress>
  </div>
</template>

<script>
  export default {
    computed: {
      recordsCount() {
        return this.$store.state.irs_record.tasks.length
      },
      unsyncedCount() {
        return this.$store.state.irs_record.tasks.filter( (i) => i._status !== 'synced' ).length
      }
    },
    methods: {
      sync() {
        this.$store.dispatch('irs_record:sync').then(() => {
          this.$store.dispatch('irs_record:buildTasks')
        })
      },
      deleteTasks() {
        this.$store.dispatch('irs_record:deleteAllTasks')
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