<template>
  <div>
    <h1>TaskEdit</h1>
    <h2>Form for task</h2>
    <p>Cluster id: {{$route.params.cluster_id}}, Task id: {{ $route.params.task_id}}</p>
    
    <md-button @click.native="$router.push({name: 'irs_record:task:view', params: {cluster_id: $route.params.cluster_id, task_id: $route.params.task_id}})">View</md-button>
    <md-button @click.native="$router.push({name: 'irs_record:task:form', params: {cluster_id: $route.params.cluster_id, task_id: $route.params.task_id}})">Form</md-button>
  </div>
</template>


<script>
  export default {
    name: 'TaskEdit',
    props: ['cluster_id', 'task_id']
  }
</script>