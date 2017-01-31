<template>
  <div>
    <router-link :to="{name: 'irs_progress:task', params: {cluster_id: 1212, task_id: 14123123}}">
      <md-button>Edit form for Cluster # {{cluster_id}} - map or list (current Tasks list)</md-button>
    </router-link>
    <cluster-map v-show="view === 'map'"></cluster-map>
    <cluster-list v-show="view === 'list'"></cluster-list>
    <md-button @click='cancel'>Cancel</md-button>
  </div>
</template>

<script>
  import ClusterMap from './map.vue'
  import ClusterList from './list.vue'

  export default {
    name: 'Cluster',
    props: ['cluster_id'],
    components: {ClusterMap, ClusterList},
    data() {
      return {
        view: 'map'
      }
    },
    methods: {
      cancel() {
        this.$router.go(-1)
      }
    }
  }  
</script>