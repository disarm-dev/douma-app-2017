<template>
  <div>
    <h1>TasksList</h1>
    <md-list>
      <md-list-item v-for='task in $store.state.irs_record.tasks'>{{task._id}}</md-list-item>
    </md-list>
  </div>
</template>


<script>
  export default {
    name: 'TasksList',
    props: ['cluster_id', 'tasks'],
  }
</script>