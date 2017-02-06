<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'IrsProgressApplet',
    mounted() {
      console.log('load clusters and tasks from Kinto store')
      this.$store.dispatch('irs_progress:retrieveTasks')
      this.$store.dispatch('irs_progress:retrieveStructures')
    }
  }
</script>
