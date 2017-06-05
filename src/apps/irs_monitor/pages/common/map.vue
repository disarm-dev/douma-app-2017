<template>
  <div id="map"></div>
</template>
<script>
  import Leaflet from 'leaflet'
  import TurfHelpers from '@turf/helpers'

  export default {
    props: ['responses', 'denominator'],
    data() {
      return {
        _map: null,
        _buildings_layer: null
      }
    },
    watch: {
      'responses': 'add_buildings'
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
      add_buildings() {
        if (this.responses.length === 0) return

        if (this._buildings_layer) { 
          this._map.removeLayer(this._buildings_layer)
          this.this._buildings_layer = null
        }

         this._buildings_layer = L.geoJSON(this.feature_collection, {
            onClick: (a, b) => {
              console.log(a,b)
            },
            pointToLayer: (feature, latlng) => {
              return L.circleMarker(latlng, {});
            },
            style: (feature, layer) => {
              let {visit_type} = feature.properties.form_data
              return {
                color: visit_type === 'first_visit' ? 'green' : 'orange',
                weight: 0.8
              }
            }
          }).bindPopup(function (layer) {
            let record = layer.feature.properties
            console.log(record)
            return `
              <p><b>Date:</b> ${record.recorded_on}</p>
              <p><b>Recorded by:</b> ${record.user}</p>
              <p><b>Visit type:</b> ${record.form_data.visit_type}</p>
              <p><b>Number of structures:</b> ${record.form_data.number_structures_total}\n</p>
            `
          })

          this._buildings_layer.addTo(this._map)

          this._map.fitBounds(this._buildings_layer.getBounds())
        
      },
    },
    computed: {
      feature_collection() {
        let points = this.responses.map((response) =>{
          let {latitude, longitude} = response.location.coords
          let point = TurfHelpers.point([longitude, latitude])
          point.properties = response
          return point
        })
        return TurfHelpers.featureCollection(points)
      }
    }
  }
</script>
<style>
  #map {
    height: 500px
  }
</style>
