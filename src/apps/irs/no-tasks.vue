<template>
  <div class="container">
    <div class="icon-container">
      <md-icon class="icon">info</md-icon>
    </div>
    <h1 class="md-title">You don't have any structures loaded.</h1>  
    <h2 class="md-subheading">Please head to the tasks page and load some structures</h2>
    <md-button class='md-raised md-accent' @click="$router.push({name: 'irs:tasks'})">Tasks</md-button>
  </div>
</template>