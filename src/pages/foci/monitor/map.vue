<template>
  <div id="monitor-map"></div>
</template>

<script>
  import Leaflet from 'leaflet'
  import firebase from 'firebase'
  import "leaflet-draw/dist/leaflet.draw.js"
  import "leaflet-draw/dist/leaflet.draw.css"
  import 'leaflet/dist/leaflet.css'
  export default {
    data(){
      return {
        map: {},
        db: firebase.database().ref().child('foci')
      }
    },
    mounted() {
      this.map = Leaflet.map('monitor-map', {
        center: [-26.3231769,31.1380957],
        zoom: 15,
        tms: true
      });
      const url = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      
      Leaflet.tileLayer(url).addTo(this.map);
      
      const drawnItems = new L.FeatureGroup();

      this.db.once('value', (snapshot) => {
        console.log(snapshot.val())
        const foci = snapshot.val();
        for (const key in foci) {
          console.log(key)
          const poly = new Leaflet.polygon(foci[key].spacial)
          poly.on('click', (e) => {
            console.log('do something with:', key)
          })
          drawnItems.addLayer(poly)
        }
      })


      this.map.addLayer(drawnItems)

      const drawControl = new L.Control.Draw({
        draw: {
          polygon: {
            allowIntersection: false,
          },
          marker: false,
          polyline: false,
          rectangle: false,
          circle: false
        },
        edit: {
          featureGroup: drawnItems
        }
      });

      this.map.addControl(drawControl);

      this.map.on('draw:created', (e) => {
        const {layer} = e;
        this.db.push({spacial: layer.getLatLngs()})
        drawnItems.addLayer(layer)
      })
    }
  }
</script>

<style scoped>
  #monitor-map {
    z-index: 0;
    height: 85vh;
    overflow: hidden;
  }

</style>