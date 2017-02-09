<template>
  <div>
    <h2>List of LOCAL Clusters</h2>
    <md-list>
      <md-list-item v-for="cluster in $store.state.irs_record.clusters" @click.native="$router.push({name: 'irs_record:cluster:view', params: {cluster_id: cluster._id}})">
        <md-icon>move_to_inbox</md-icon> <span>{{cluster.name}} - {{cluster._id}}</span>
      </md-list-item>
    </md-list>

    <md-button @click.native="$router.push({name: 'irs_record:clusters'})">List</md-button>
    <md-button @click.native="$router.push({name: 'irs_record:clusters:map'})">Map</md-button>
    <md-button @click.native="$router.push({name: 'irs_record:clusters:search'})">Search</md-button>
    <md-button @click.native="$router.push({name: 'irs_record:clusters:edit'})">Edit</md-button>
    <md-button @click.native="$store.dispatch('irs_record:sync_tasks')" class='md-warn'>SYNC</md-button>
    <md-button @click.native="$store.dispatch('irs_record:clear_local_dbs')" class='md-accent'>CLEAR LOCAL</md-button>
    <md-button @click.native="$store.dispatch('irs_record:seed_local_data_from_files')" class='md-accent'>SEED from FILES</md-button>
    <md-button @click.native="$store.dispatch('irs_record:seed_local_data_from_remote')" class='md-accent'>SEED from REMOTE</md-button>
  </div>
</template>

<script>
  export default {
    name: 'Clusters'
  }
</script>