<template>
  <p>Click areas to add or remove them</p>
</template>

<script> 
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
  import 'mapbox-gl/dist/mapbox-gl.css'
  import SWZ_ous from './swz.ous.json'

  export default {
    name: 'FormalSingle',
    props: ['formal_areas', 'show_preview'],
    data () {
      return {
      }
    },
    mounted() {
      this.create_map()
      this.draw_localities()
      this.handleClicks()
    },
    methods: {
      create_map() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [31.50484892885717, -26.543508675283874],
          zoom: 7.34
        })
      },
      draw_localities() {
        this.map.on('load', () => {
          let fc = {
            type: 'FeatureCollection',
            features: SWZ_ous.features.map((f, i) => {
              f.properties.selected = i % 2 == 0
              return f
            })
          }

          this.map.addLayer({
            'id': 'localities',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': fc
            },
            "paint": {
              'fill-color': {
                property: 'selected',
                type: 'categorical',
                stops: [
                    ['true', 'green'],
                    ['false', 'red'],
                ]
              },
              'fill-opacity': 0.7
            }
          })  
        })
      },
      handleClicks() {
        this.map.on('click', (e) => {
          let map = this.map
          debugger
          var features = this.map.queryRenderedFeatures(e.point, {layers: ['localities']});
          features.forEach((f) => {
            f.properties.selected = !f.properties.selected
          })
        })
      }
    }
  }
</script>

<style lang="css" scoped>
</style>






'circle-color': {
      property: 'ethnicity',
      type: 'categorical',
      stops: [
          ['White', '#fbb03b'],
          ['Black', '#223b53'],
          ['Hispanic', '#e55e5e'],
          ['Asian', '#3bb2d0'],
          ['Other', '#ccc']]
  }