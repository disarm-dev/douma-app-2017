<template>
  <div>
    <h1>TasksList</h1>
    <md-list>
      <md-list-item v-for='task in $store.state.irs_record.tasks' @click.native="$router.push({name: 'irs_record:task', params: {cluster_id: cluster_id, task_id: task._id}})">{{task._id}}</md-list-item>
    </md-list>
  </div>
</template>


<script>
  export default {
    name: 'TasksList',
    props: ['cluster_id', 'tasks'],
  }
</script>