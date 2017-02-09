<template>
  <div>
    <h1>ClusterView</h1>
    <router-view></router-view>
    <md-button @click.native="$router.push({name: 'irs_record:clusters_search'})">Search</md-button>
    <md-button @click.native="$router.push({name: 'irs_record:clusters:list'})">List</md-button>
    <md-button @click.native="$router.push({name: 'irs_record:clusters:map'})">Map</md-button>
    <md-button @click.native="$router.push({name: 'irs_record:clusters:edit'})">Edit</md-button>
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