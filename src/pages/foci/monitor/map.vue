<template>
  <div id="monitor-map"></div>
</template>

<script>
  import Leaflet from 'leaflet'
  export default {
    data() {
      return {
        map: {}
      }
    },
    mounted() {
      this.map = Leaflet.map('identify-map', {
        tms: true
      });
    }
  }
</script>
