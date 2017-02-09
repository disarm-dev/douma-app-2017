<template>
  <div>
    <h1>TasksMap</h1>
    <h2>Map of Tasks (Structures) for given Cluster</h2>
    <p>Cluster id: {{$route.params.cluster_id}}</p>

    <md-button @click.native="$router.push({name: 'irs_record:tasks:list', params: {cluster_id: $route.params.cluster_id}})">List</md-button>
    <md-button @click.native="$router.push({name: 'irs_record:tasks:map', params: {cluster_id: $route.params.cluster_id}})">Map</md-button>
  </div>
</template>


<script>
  export default {
    name: 'TasksMap',
    props: ['cluster_id']
  }
</script>