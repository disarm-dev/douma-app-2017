<template>
  <div class="container">
    <div class="icon-container">
      <md-icon class="icon">info</md-icon>
    </div>
    <h1 class="md-title">You don't have an active foci.</h1>  
    <h2 class="md-subheading">Please head to the monitoring page to start selecting or creating one</h2>
    <md-button class='md-raised md-accent' @click.native="$router.push({name: 'foci:monitor'})">Monitor</md-button>
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