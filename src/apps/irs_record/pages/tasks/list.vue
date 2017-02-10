<template>
  <div>
    <h1>TasksList</h1>
    {{$store.state.irs_record.tasks.length}}
  </div>
</template>


<script>
  export default {
    name: 'TasksList',
    props: ['cluster_id', 'tasks'],
  }
</script>