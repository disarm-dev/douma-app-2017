<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'IrsProgressApplet',
    mounted() {
      // Launch the IRS Progress app, by loading the local data
      this.$store.dispatch('irs_progress:load_local_data')
    }
  }
</script>
