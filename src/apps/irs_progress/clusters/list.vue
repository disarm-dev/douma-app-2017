<template>
  <div>
    <h2>List of LOCAL Clusters</h2>
    <md-list>
      <md-list-item v-for="cluster in $store.state.irs_progress.clusters" @click="$router.push({name: 'irs_progress:cluster:view', params: {cluster_id: cluster.id}})">
        <md-icon>move_to_inbox</md-icon> <span>{{cluster.name}} - {{cluster.id}}</span>
      </md-list-item>
    </md-list>

    <md-button @click="$router.push({name: 'irs_progress:clusters'})">List</md-button>
    <md-button @click="$router.push({name: 'irs_progress:clusters:map'})">Map</md-button>
    <md-button @click="$router.push({name: 'irs_progress:clusters:search'})">Search</md-button>
    <md-button @click="$router.push({name: 'irs_progress:clusters:edit'})">Edit</md-button>
    <md-button @click="$store.dispatch('irs_progress:sync_tasks')" class='md-warn'>SYNC</md-button>
    <md-button @click="$store.dispatch('irs_progress:clear_local_data')" class='md-accent'>CLEAR LOCAL</md-button>
    <md-button @click="$store.dispatch('irs_progress:seed_local_data')" class='md-accent'>SEED LOCAL</md-button>
  </div>
</template>

<script>
  export default {
    name: 'Clusters'
  }
</script>