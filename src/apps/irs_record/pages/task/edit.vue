<template>
  <div>
    <h1>TaskEdit</h1>
    <div>
      {{task}}
    </div>

  </div>
</template>


<script>
  export default {
    name: 'TaskEdit',
    props: ['cluster_id', 'task_id', 'task']
  }
</script>