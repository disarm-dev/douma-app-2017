<template>
  <div id="monitor-map"></div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  export default {
    data(){
      return {
        map: {}  
      }
    },
    mounted() {
      this.map = Leaflet.map('monitor-map', {
        center: [-26.512, 31.160],
        zoom: 10,
        tms: true
      });
      const url = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      Leaflet.tileLayer(url).addTo(this.map);
    }
  }
</script>

<style scoped>
  #monitor-map {
    height: 85vh;
    overflow: hidden;
  }

</style>