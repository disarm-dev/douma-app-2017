<template>
  <div>
    <h2>View individual cluster</h2>
    <p>Cluster id: {{$route.params.cluster_id}}</p>
    
    <div>
      <md-button class="md-raised" @click="$router.push({name: 'irs_progress:tasks:list', params: {cluster_id: $route.params.cluster_id}})">Tasks for cluster</md-button>
    </div>

    <md-button @click="$router.push({name: 'irs_progress:cluster:view'})">View</md-button>
    <md-button @click="$router.push({name: 'irs_progress:cluster:map'})">Map</md-button>
  </div>
</template>