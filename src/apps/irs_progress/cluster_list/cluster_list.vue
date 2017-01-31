<template>
  <div style="margin: 0 auto; max-width: 700px;">
    <span class="md-headline">Clusters</span>
    <md-list>
      <md-list-item v-for="cluster in clusters" @click="setActiveCluster(cluster)">
        <md-icon>move_to_inbox</md-icon> <span>No. #{{cluster}}</span>
      </md-list-item>
    </md-list>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        clusters: [
          {id: 67812387123, name: 'moko'},
          {id: 61812371911, name: 'concreate'},
          {id: 75178121312, name: 'tract'}
        ]
      }
    },
    methods: {
      setActiveCluster(cluster) {
        console.log(cluster)
        this.$router.push({name: 'irs_progress:cluster', params: {cluster_id: cluster.id}})
      }
    }
  }
</script>