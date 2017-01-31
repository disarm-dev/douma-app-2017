<template>
  A cluster  
  <md-button @click='cancel'>Cancel</md-button>
</template>

<script>
  export default {
    name: 'Cluster',
    methods: {
      cancel() {
        console.log('cancel')
      }
    }
  }  
</script>