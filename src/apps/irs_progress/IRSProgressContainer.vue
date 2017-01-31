<template>
  <div v-if='true'>ClusterList</div>
  <div v-else-if='false'>Cluster</div>
  <div v-else>Task</div>
</template>

<script>
  export default {
    name: 'IrsProgressRoot',
    mounted() {
    },
    data() {
      return {
        clustersSearchResults: [],
      }
    }
  }
</script>

<style>
</style>