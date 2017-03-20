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
        selected_uniqloccods: []
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

          this.map.addLayer({
            'id': 'localities',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': SWZ_ous
            },
            "paint": {
              'fill-color': 'green',
              'fill-opacity': 0.7
            }
          })  


          this.map.addLayer({
            'id': 'localities_higlighted',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': SWZ_ous
            },
            "paint":{
              'fill-color': 'red',
              'fill-opacity': 0.3
            },
            "filter": ['in', 'UniqLocCod', '']
          }) 


        })
      },
      handleClicks() {
        this.map.on('click', (e) => {
          var clicked_features = this.map.queryRenderedFeatures(e.point, {layers: ['localities']});
          clicked_features.forEach((f) => {
            const UniqLocCod = f.properties.UniqLocCod
            if (this.selected_uniqloccods.includes(UniqLocCod)) {
              const index = this.selected_uniqloccods.findIndex(i => i === UniqLocCod)
              this.selected_uniqloccods.splice(index, 1)
            } else {
              this.selected_uniqloccods.push(UniqLocCod)
            }
          })

          this.map.setFilter('localities_higlighted', ['in', 'UniqLocCod'].concat(this.selected_uniqloccods))
        })
      }
    }
  }
</script>

<style lang="css" scoped>
</style>
