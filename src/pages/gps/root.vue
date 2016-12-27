<template>
  <div id="gps-example"></div>
</template>
<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  export default {
    mounted() {
      this.lmap = Leaflet.map('gps-example', {tms: true})

      const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'
      
      Leaflet.tileLayer(url).addTo(this.lmap)

      this.lmap.locate({setView: true, maxZoom: 16})
      this.lmap.on('locationfound', this.onLocationFound)
      this.lmap.on('locationerror', this.onLocationError)
      
      // Might need this for real time updates
      if ('geolocation' in navigator) {
        this.watchID = navigator.geolocation.watchPosition((position) => {
          console.log(position.coords.latitude, position.coords.longitude);
        });  
      }
      
    },
    beforeDestroy() {
      if ("geolocation" in navigator) {
        navigator.geolocation.clearWatch(this.watchID);
      }
    },
    data() {
      return {
        lmap: null,
        watchID: null
      }
    },
    methods: {
      onLocationFound(e) {
        var radius = e.accuracy / 2;

        Leaflet.marker(e.latlng).addTo(this.lmap).bindPopup(`You are within ${radius} meters from this point`).openPopup();

        Leaflet.circle(e.latlng, radius).addTo(this.lmap);
      },
      onLocationError(e) {
        alert(e.message);
      }
    }
  }
</script>
<style>
  #gps-example {
    z-index: 0;
    min-height: 85vh;
    overflow: hidden;
  }
</style>