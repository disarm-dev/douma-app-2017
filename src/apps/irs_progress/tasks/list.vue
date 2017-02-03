<template>
  <div>
    <h2>List of Tasks (Structures) for given Cluster</h2>
    <p>Cluster id: {{$route.params.cluster_id}}</p>
    <div>
      <md-button class="md-raised" @click="$router.push({name: 'irs_progress:task:view', params: {cluster_id: $route.params.cluster_id, task_id: '222'}})">Go to a task</md-button>
    </div>

    <md-button @click="$router.push({name: 'irs_progress:tasks:list', params: {cluster_id: $route.params.cluster_id}})">List</md-button>
    <md-button @click="$router.push({name: 'irs_progress:tasks:map', params: {cluster_id: $route.params.cluster_id}})">Map</md-button>
  </div>
</template>