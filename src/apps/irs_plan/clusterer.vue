<template>
  <iframe id="clusterer" src="https://hughapps.shinyapps.io/ClusterStructures/" frameborder="0"></iframe>
</template>

<script>
  export default {
    name: 'IRSPlanClusterer'
  }
</script>


<style>
  #clusterer {
    height: calc(100vh - 64px);
    width: 100%;
  }
</style>