<template>
  <div>
    <h1>TasksView</h1>
    <md-button @click.native="toggle_view">{{toggle_to_view}}</md-button>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'TasksView',
    props: ['cluster_id'],
    mounted() {
      // Find Cluster from URL params, and get matching Tasks and Spatial Entities. Need to wait until parent calls `mounted()` to ensure $store.clusters is set 
      this.$store.dispatch("irs_record:set_tasks_for_cluster", this.cluster_id)
    },
    computed: {
      toggle_to_view() {
        if (this.$route.meta && this.$route.meta.type === 'map') {
          return 'list'
        } else {
          return 'map'
        }
      }
    },
    methods: {
      toggle_view() {
        this.$router.push({name: `irs_record:tasks:${this.toggle_to_view}`, params: {cluster_id: this.cluster_id}})
      },
    }
  }
</script>