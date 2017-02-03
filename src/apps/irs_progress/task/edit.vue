<template>
  <div>
    <h2>Form for task</h2>
    <p>Cluster id: {{$route.params.cluster_id}}, Task id: {{ $route.params.task_id}}</p>
    
    <md-button @click="$router.push({name: 'irs_progress:task:view', params: {cluster_id: $route.params.cluster_id, task_id: '222'}})">View</md-button>
    <md-button @click="$router.push({name: 'irs_progress:task:form', params: {cluster_id: $route.params.cluster_id, task_id: '222'}})">Form</md-button>
  </div>
</template>