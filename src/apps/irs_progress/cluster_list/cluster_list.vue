<template>
  <div>
    <h2>List of Clusters</h2>
    <md-list>
      <md-list-item v-for="cluster in clusters">
        <router-link :to="{name: 'irs_progress:cluster', params: {cluster_id: cluster.id}}">
          <md-icon>move_to_inbox</md-icon> <span>No. #{{cluster}}</span>
        </router-link>
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
    }
  }
</script>