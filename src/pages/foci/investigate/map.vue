<template>
  <div>
    <md-button class='md-raised md-accent' @click="$router.push({name: 'investigate:detail'})">Summary</md-button>
    <md-button class='md-raised md-accent' @click="$router.push({name: 'investigate:form'})">Form</md-button>
    <h1 class="md-title">{{$route.fullPath}}</h1>
  </div>
</template>

<script>
  export default {
    
  }
</script>