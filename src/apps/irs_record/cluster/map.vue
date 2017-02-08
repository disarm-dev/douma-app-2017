<template>
  <div>
    <h2>Map individual cluster</h2>
    <p>Cluster id: {{$route.params.cluster_id}}</p>

    <md-button @click="$router.push({name: 'irs_record:cluster:view', params: {cluster_id: $route.params.cluster_id}})">View</md-button>
    <md-button @click="$router.push({name: 'irs_record:cluster:map', params: {cluster_id: $route.params.cluster_id}})">Map</md-button>
  </div>
</template>

<script>
  export default {
  }
</script>