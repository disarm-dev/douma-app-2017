<template>
  <div>
    <p>Select risk level on slider</p>
    <vue-slider v-bind="slider_options" v-model="risk_slider_value" ref='slider'></vue-slider>

    <div id="map"></div>
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
  import 'mapbox-gl/dist/mapbox-gl.css'

  import vueSlider from 'vue-slider-component'
  import SWZ_ous from './swz.ous.json'


  export default {
    name: 'FormalBulk',
    components: {vueSlider},
    props: ['formal_areas', 'show_preview'],
    data () {
      return {
        map: null,
        localities: [],
        risk_slider_value: SWZ_ous.features.length,
        slider_options: {
          min: 0,
          max: SWZ_ous.features.length,
          interval: 1,
          lazy: true,
          tooltipDir: 'bottom',
          // tooltip: 'always',
          formatter: '{value} local areas'
        }
      }
    },
    mounted() {
      this.create_map()
      this.draw_localities()
    },
    watch: {
      'risk_slider_value': 'update'
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

          // TODO @debug creating an attribute to sort by
          this.localities = SWZ_ous.features.map((l, i) => {
            l.properties.risk = (i + 1)
            return l
          })

          let fc = {
            type: 'FeatureCollection', 
            features: this.localities
          }
          this.map.addLayer({
            'id': 'localities',
            'type': 'line',
            'source': {
              'type': 'geojson',
              'data': fc
            },
            'paint': {
              'line-color': '#4FC3F7',
              'line-opacity': 0.7
            }
          })  
        })
      },
      update() {
        if (this.map) {
          this.map.setFilter('localities', ['<', 'risk', this.risk_slider_value])
        }
      },
      getLocalities() {
        // TODO @debug fix when getting real attribute to sort by
        return this.localities.slice(0, this.risk_slider_value)
      }
    }
  }
</script>

<style lang="css" scoped>
  #map {
    /*height: 500px*/
  }
</style>