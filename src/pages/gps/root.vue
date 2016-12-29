<template>
  <div id="gps-example"></div>
</template>
<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  export default {
    mounted() {

      // Read more: https://www.w3.org/TR/2016/REC-geolocation-API-20161108/

      this.lmap = Leaflet.map('gps-example', {tms: true})

      const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'
      
      Leaflet.tileLayer(url).addTo(this.lmap)

      if ('geolocation' in navigator) {
        // watchPosition() also emits a location initially, no need for getCurrentPosition()
        this.watchID = navigator.geolocation.watchPosition((position) => {
          let {accuracy} = position.coords // accuracy is in m
          this.onLocationFound({latlng: L.latLng(position.coords.latitude, position.coords.longitude), accuracy})
        }, e => console.log(e), {enableHighAccuracy: true});  // can disable highAccuracy for better performance, maybe check this dynamically somehow?

        this.accuracyLabel = L.control.attribution({
          prefix: ``,
          position: 'topright'
        }).addTo(this.lmap)

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
        marker: null,
        accuracyLabel: null
      }
    },
    methods: {
      onLocationFound({latlng, accuracy}) {
        this.accuracyLabel.setPrefix(`<p style="font-size:20px;margin:0;">Accuracy: ${accuracy}m</p>`)
        this.lmap.setView(latlng, 17)
        if (this.marker) {
          this.marker.setLatLng(latlng);
        } else {
          this.marker = Leaflet.marker(latlng).addTo(this.lmap)
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