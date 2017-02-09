<template>
  <div>
    <h1>TasksView</h1>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'TasksView',
    props: ['cluster_id']
  }
</script>