<template>
  <div>
    <md-button class='md-raised md-accent' @click="$router.push({name: 'investigate:form'})">Form</md-button>
    <md-button class='md-raised md-accent' @click="$router.push({name: 'investigate:map'})">Map</md-button>
    <h1>Summary of foci #'something'</h1>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    mounted() {

    },
    computed: {
    },
    methods: {
    }
  }
</script>

<style>
</style>