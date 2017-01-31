<template>
  <div v-if='view === "cluster-list"'><cluster-list></cluster-list></div>
  <div v-else-if='view === "cluster"'><cluster></cluster></div>
  <div v-else-if='view === "task"'><task></task></div>
</template>

<script>
  import ClusterList from "./cluster_list/cluster_list.vue"
  import Cluster from "./cluster/cluster.vue"
  import Task from "./task/task.vue"

  export default {
    name: 'IrsProgressRoot',
    components: {ClusterList, Cluster, Task},
    computed: {
      view() {
        if (!this.$store.state.irs_progress.activeCluster && !this.$store.state.irs_progress.activeTask) {
          return "cluster-list"
        } else if (this.$store.state.irs_progress.activeCluster && !this.$store.state.irs_progress.activeTask) {
          return "cluster"
        } else {
          return "task"
        }
      }
    }
  }
</script>

<style>
</style>