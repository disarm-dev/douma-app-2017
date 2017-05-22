<template>
  <div id="map" ref="map"></div>
</template>
<script>
  import Leaflet from 'leaflet'
  
  export default {
    props: ['height'],
    data() {
      return {
        _map: null,
        _buildings_layer: null
      }
    },
    mounted() {
      this.$refs.map.style.height = this.height + 'px'
      this.create_map()
    },
    methods: {
      create_map() {
        this._map = Leaflet.map('map', {
          tms: true,
          center: [-19.3458, 20.6273],
          zoom: 14
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
          20.6488037109375,
          -19.352610894378625
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          20.640220642089844,
          -19.352610894378625
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          20.64434051513672,
          -19.361032701220033
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          20.60588836669922,
          -19.31827133753736
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          20.634727478027344,
          -19.35811750960557
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          20.628890991210938,
          -19.373340713364044
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
  
</style>