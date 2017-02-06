<template>
  <div>
    <h2>Cluster - not using this?</h2>
    <ul>
      <router-link :tag='li' v-for='task in tasks' :to="{name: 'irs_progress:task', params: {cluster_id: cluster_id, task_id: task.id}}">
        Edit {{task.name}}
      </router-link>
    </ul>
    <md-button @click='cancel'>Cancel</md-button>
  </div>
</template>

<script>
  import ClusterMap from './map.vue'
  import ClusterList from './list.vue'

  export default {
    name: 'Cluster',
    components: {ClusterMap, ClusterList},
    data() {
      return {
        tasks: [
          {id: 334341, name: 'electrotonus' },
          {id: 334342, name: 'stockannet' },
          {id: 334343, name: 'propagandist' },
          {id: 334344, name: 'unendued' },
        ]
      }
    },
    computed: {
      // TODO: @fix What is vue-router doing with our params? Why not setting as props?
      cluster_id() {
        return this.$route.params.cluster_id
      }
    },
    methods: {
      cancel() {
        this.$router.go(-1)
      }
    }
  }  
</script>