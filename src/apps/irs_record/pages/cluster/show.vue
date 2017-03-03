<template>
  <div>
    <h1>ClusterShow</h1>
    Tasks count: {{cluster.task_ids.length}}
  </div>
</template>

<script>
  export default {
    name: 'ClusterShow',
    props: ['cluster_id'],
    mounted() {
      console.log('ClusterShow', this.cluster)
    },
    computed: {
      cluster() {
        return this.$store.state.irs.clusters.find(cluster => cluster._id === this.cluster_id)
      }
    }
  }
</script>