<template>
  <router-view 
    :clusters='$store.state.irs.clusters'
    :unsynced_clusters='$store.getters.unsynced_clusters'>
  </router-view>
</template>

<script>
  export default {
    name: 'TaskerApplet',
    mounted() {
      this.$store.dispatch("irs:get_clusters") // TODO: @refac getting clusters so it's not called by components. is possible?
    }
  }
</script>