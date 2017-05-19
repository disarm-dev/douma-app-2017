<template>

  <div id="map"></div>
</template>
<script>
  import Leaflet from 'leaflet'
  
  export default {
    data() {
      return {
        _map: null,
        _buildings_layer: null
      }
    },
    mounted() {
      this.create_map()
    },
    methods: {
      create_map() {
        this._map = Leaflet.map('map', {
          tms: true,
          center: [-26.1288, 31.9892],
          zoom: 16
        });

        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        Leaflet.tileLayer(url).addTo(this._map);

        this.add_buildings()
      },
      add_buildings(place) {
        this._buildings_layer = L.geoJSON(this.geojson, {
          style: (feature, layer) => {
            return {
              weight: 0.8
            }
          }
        })
        this._buildings_layer.addTo(this._map)
      },
    },
    computed: {
      geojson() {
        return {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          31.993217468261715,
          -26.1310902352504
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          31.990470886230472,
          -26.1313984661397
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          31.98841094970703,
          -26.12215118563835
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          31.981544494628903,
          -26.13016553770187
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          31.9921875,
          -26.126004308140512
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          31.988153457641598,
          -26.133324890767675
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          31.99690818786621,
          -26.13317077796681
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          31.993732452392575,
          -26.13548244862496
        ]
      }
    }
  ]
}
      }
    }
  }
</script>
<style>
  #map {
    height: 500px
  }
</style>