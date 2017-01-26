<template>
  <div class="container">
    <div class="icon-container">
      <md-icon class="icon">info</md-icon>
    </div>
    <h1 class="md-title">You don't have an active action.</h1>  
    <h2 class="md-subheading">Please head to the tasks list or map page to select one</h2>
    <md-button class='md-raised md-accent' @click="$router.push({name: 'irs:tasks'})">Tasks</md-button>
    <md-button class='md-raised md-accent' @click="$router.push({name: 'irs:map'})">Map</md-button>
  </div>
</template>