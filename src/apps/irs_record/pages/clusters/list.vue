<template>
  <div>
    <h1>ClustersList</h1>
    <md-list>
      <md-list-item v-for="cluster in $store.state.irs_record.clusters" @click.native="$router.push({name: 'irs_record:cluster', params: {cluster_id: cluster._id}})">
        <md-icon>move_to_inbox</md-icon> <span>{{cluster.name}} - {{cluster._id}}</span>
      </md-list-item>
    </md-list>

  </div>
</template>

<script>
  export default {
    name: 'ClustersList',
    computed: {
      unsynced_tasks(cluster) {
        this.$store.state.irs_record.clusters.filter
        // load tasks
        // find synced
        // add unsynced_count to each Cluster
      }
    }
  }
</script>