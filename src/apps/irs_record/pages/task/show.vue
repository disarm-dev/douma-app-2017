<template>
  <div>
    <h1>TaskShow</h1>
    <p>Cluster id: {{$route.params.cluster_id}}, Task id: {{ $route.params.task_id}}</p>

    <div>
      {{task}}
    </div>

  </div>
</template>

<script>
  export default {
    name: 'TaskShow',
    props: ['cluster_id', 'task_id', 'task'],
    computed: {
    }
  }
</script>