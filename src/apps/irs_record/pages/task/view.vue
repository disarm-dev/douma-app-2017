<template>
  <div>
    <h1>TaskView</h1>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'TaskView',
    props: ['cluster_id', 'task_id']
  }
</script>