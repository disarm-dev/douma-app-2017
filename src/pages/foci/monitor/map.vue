<template>
  <div>
  <div id="monitor-map">
    
  </div>
  <md-button @click="draw">Draw Map</md-button>
  </div>
</template>

<script>
  import Leaflet from 'leaflet'

  export default {
    data(){
      return {
        map: {}  
      }
    },
    mounted() {
      
    },
    methods: {
      draw() {
        this.map = Leaflet.map('monitor-map', {
          // attributionControl: false,
          center: [-26.512, 31.160],
          zoom: 10,
          tms: true
        });
        const url = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        Leaflet.tileLayer(url).addTo(this.map);
      }
    }
  }
</script>

<style scoped>
  #monitor-map {
    max-height: 80vh;
    overflow: hidden;
  }

</style>