<template>
  <div class="container">
    <div class="icon-container">
      <md-icon class="icon">info</md-icon>
    </div>
    <h1 class="md-title">You don't have an active structure.</h1>  
    <h2 class="md-subheading">Please head to the map or list page to select one</h2>
    <md-button class='md-raised md-accent' @click="$router.push({name: 'irs:map'})">Map</md-button>
    <md-button class='md-raised md-accent' @click="$router.push({name: 'irs:list'})">List</md-button>
  </div>
</template>

<script>
  export default {
  }
</script>


<style>
  .container {
    padding: 1em;
  }
  
  .icon-container {
    padding-top: 2em;
  }

  .icon {
    font-size: 60px;
  }
</style>