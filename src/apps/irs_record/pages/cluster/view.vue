<template>
  <div>
    <router-view></router-view>
  </div>
</template>


<script>
  export default {
    name: 'ClusterView',
    computed: {
      cluster_id() {
        return this.$route.params.cluster_id
      },
      tasks(){
        return []
        // const task_ids = this.$store.state.irs_record.clusters
        //   .find((cluster) => cluster._id === this.$route.params.cluster_id).task_ids

        // return this.$store.state.irs_record.tasks.filter((task) => task_ids.includes(task._id))
      }
    }
  }
</script>