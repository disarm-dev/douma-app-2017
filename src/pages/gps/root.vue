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

      if ('geolocation' in navigator) {
        this.watchID = navigator.geolocation.watchPosition((position) => {
          this.onLocationFound({latlng: L.latLng(position.coords.latitude, position.coords.longitude)})
        });  
      } else {
        alert('GPS is not supported ')
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
        watchID: null,
        marker: null
      }
    },
    methods: {
      onLocationFound({latlng}) {
        if (this.marker) {
          this.marker.setLatLng(latlng);
          this.lmap.setView(latlng, 17)
        } else {
          this.marker = Leaflet.marker(latlng).addTo(this.lmap)
          this.lmap.setView(latlng, 17)
        }
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