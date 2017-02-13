<template>
  <div style="position:relative">
    
    <md-speed-dial style='z-index: 10000' md-open="click" md-direction="bottom" class="md-fab-top-right">
      <md-button class="md-fab" md-fab-trigger>
        <md-icon md-icon-morph>close</md-icon>
        <md-icon>menu</md-icon>
      </md-button>

      <md-button class="md-fab md-primary md-mini md-clean" @click.native="navigate('map')">
        <md-icon>map</md-icon>
      </md-button>

      <md-button class="md-fab md-primary md-mini md-clean" @click.native="navigate('list')">
        <md-icon>list</md-icon>
      </md-button>


    </md-speed-dial>

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
      navigate(route) {
        this.$router.push({name: `irs_record:tasks:${route}`, params: {cluster_id: this.cluster_id}})
      },
    }
  }
</script>