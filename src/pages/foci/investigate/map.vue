<template>
  <div>
    <md-button class='md-raised md-accent' @click="$router.push({name: 'foci:investigate:detail'})">Summary</md-button>
    <md-button class='md-raised md-accent' @click="$router.push({name: 'foci:investigate:form'})">Form</md-button>
    <h1 class="md-title">{{$route.fullPath}}</h1>
  </div>
</template>

<script>
  export default {
    
  }
</script>