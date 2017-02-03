<template>
  <div>
    <h2>List of Clusters</h2>
    <md-list>
      <md-list-item v-for="cluster in clusters" @click="$router.push({name: 'irs_progress:cluster:view', params: {cluster_id: cluster.id}})">
        <md-icon>move_to_inbox</md-icon> <span>No. #{{cluster}}</span>
      </md-list-item>
    </md-list>

    <md-button @click="$router.push({name: 'irs_progress:clusters'})">List</md-button>
    <md-button @click="$router.push({name: 'irs_progress:clusters:map'})">Map</md-button>
    <md-button @click="$router.push({name: 'irs_progress:clusters:search'})">Search</md-button>
    <md-button @click="$router.push({name: 'irs_progress:clusters:edit'})">Edit</md-button>
  </div>
</template>

<script>
  export default {
    name: 'Clusters',
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