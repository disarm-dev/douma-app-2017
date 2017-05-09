<template>
  <div>
    <div class="container">
      <selection-stats></selection-stats>

      <div class="controls">
        <formal-bulk></formal-bulk>
      </div>
    </div>

  </div>
</template>

<script>
  import FormalBulk from './formal_bulk.vue'
  import SelectionStats from './selection-stats.vue'

  export default {
    name: 'AreasView',
    components: {FormalBulk, SelectionStats},
  }
</script>

<style scoped>
  .container {
    margin: 10px;
  }

  .controls {
    background: #eaeaea;
    padding: 5px;
  }

</style>
