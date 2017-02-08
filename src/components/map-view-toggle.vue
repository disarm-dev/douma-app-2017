<template>
  <md-button @click.native='toggleView'>{{otherView}}</md-button>
</template>

<script>
  export default {
    computed: {
      otherView() {
        return 'map'
      }
    },
    methods: {
      toggleView() {
        console.log("toggle!")
      }
    }
  }
</script>
