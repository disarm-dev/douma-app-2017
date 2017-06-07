<template>
  <div id="map"></div>
</template>
<script>
  import Leaflet from 'leaflet'
  import TurfHelpers from '@turf/helpers'
  import Translations from '@/lib/translations'
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
    computed: {
      feature_collection() {
        let points = this.responses.map((response) =>{
          let {latitude, longitude} = response.location.coords
          let point = TurfHelpers.point([longitude, latitude])
          point.properties = response
          return point
        })
        return TurfHelpers.featureCollection(points)
      },
      instance_config() {
        return this.$store.state.instance_config
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
      add_buildings() {
        if (this.responses.length === 0) return

        if (this._buildings_layer) { 
          this._map.removeLayer(this._buildings_layer)
          this.this._buildings_layer = null
        }

        const instance_translations = new Translations[this.instance_config.slug](this.instance_config)

        this._buildings_layer = L.geoJSON(this.feature_collection, {
          // onClick: (a, b) => {
          //   console.log(a,b)
          // },
          pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {radius: 5, fillOpacity: 0.9});
          },
          style: (feature, layer) => {
            const base_style = {fill: false}
            const instance_style = instance_translations.getMapStyle(feature, layer)
            return {...instance_style, base_style}
          }
        }).bindPopup(function (layer) {
            return instance_translations.getPopupDescription(layer)
        })

        this._buildings_layer.addTo(this._map)

        this._map.fitBounds(this._buildings_layer.getBounds())
        
      },
    },
    
  }
</script>
<style>
  #map {
    height: 500px
  }
</style>
