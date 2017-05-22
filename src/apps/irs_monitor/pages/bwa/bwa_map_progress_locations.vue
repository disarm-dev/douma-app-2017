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
          pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {});
          },
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
          25.548877716064453,
          -18.44346144596816
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          25.55196762084961,
          -18.446881140431163
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          25.556087493896484,
          -18.448183863271726
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          25.55368423461914,
          -18.45046360446673
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          25.558319091796875,
          -18.44427566511007
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          25.54269790649414,
          -18.44948657623151
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          25.539779663085934,
          -18.44704398132656
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          25.57170867919922,
          -18.464467064894613
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