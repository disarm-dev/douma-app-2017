<template>
  <div>
    <h1>You don't have an active foci.</h1>  
    <h2>Please head to the monitoring page to start selecting or creating one</h2>
    <md-button class='md-raised md-accent' @click="$router.push({name: 'monitor'})">Monitor</md-button>
  </div>
</template>

<script>
  export default {
  }
</script>
