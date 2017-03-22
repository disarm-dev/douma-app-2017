<template>
  <div>
    <p>You are now {{include ? 'Including' : 'Excluding'}}</p>
    <md-button @click.native="toggle_mode">{{include ? 'Exclude' : 'Include'}}</md-button>
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
        include: true,
        map: null,
        
        included_localities: [],
        excluded_localities: [],

        localities: [],
        bulk_selected: [],
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
    computed: {
      AllUniqLocCods() {
        return this.localities.map(l => l.properties.UniqLocCod)
      }
    },
    mounted() {
      this.create_map()
      this.draw_localities()
      this.handleClicks()
    },
    watch: {
      'risk_slider_value': 'update'
    },
    methods: {
      create_map() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/onlyjsmith/cj0kre65k002k2slaemj9yy0f',
          center: [31.50484892885717, -26.543508675283874],
          zoom: 7.34
        })
      },
      draw_localities() {
        this.map.on('load', () => {

          // TODO @debug creating an attribute to sort by
          this.localities = SWZ_ous.features.reverse().map((l, i) => {
            l.properties.risk = (i + 1)
            return l
          })

          let fc = {
            type: 'FeatureCollection', 
            features: this.localities
          }
          this.map.addLayer({
            'id': 'localities', // everything, doesn't change
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': fc
            },
            'paint': {
              'fill-outline-color': 'grey',
              'fill-color': 'transparent',
            }
          }) 

          // formal-bulk-included --> green
          // formal-bulk-excluded --> red

          this.map.addLayer({
            'id': 'bulk-included',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': fc
            },
            "paint":{
              'fill-color': '#a6dba0',
              // 'fill-opacity': 0.3
            },
            "filter": ['in', 'UniqLocCod', '']
          })

          this.map.addLayer({
            'id': 'bulk-excluded',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': fc
            },
            "paint":{
              'fill-color': '#c2a5cf',
              // 'fill-color': 'transparent',
              // 'fill-opacity': 0.3
            },
            "filter": ['!in', 'UniqLocCod', '']//.concat(this.AllUniqLocCods)
          })

          // single-included --> blue
          // single-excluded --> orange

          this.map.addLayer({
            'id': 'single-included',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': fc
            },
            "paint":{
              'fill-color': '#008837',
            },
            "filter": ['in', 'UniqLocCod', '']
          })

          this.map.addLayer({
            'id': 'single-excluded',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': fc
            },
            "paint":{
              'fill-color': '#7b3294',
            },
            "filter": ['!in', 'UniqLocCod'].concat(this.AllUniqLocCods)
          })

        })
      },
      update() {
        if (this.map) {
          const locCodes = this.localities.filter(l => l.properties.risk < (this.risk_slider_value + 1)).map(l => l.properties.UniqLocCod)
          console.log(locCodes)
          this.map.setFilter('bulk-included', ['in', 'UniqLocCod'].concat(locCodes))
          this.map.setFilter('bulk-excluded', ['!in', 'UniqLocCod'].concat(locCodes))
        }
      },
      getLocalities() {
        // TODO @debug fix when getting real attribute to sort by
        return this.localities.slice(0, this.risk_slider_value).map(l => l.properties.UniqLocCod)
      },
      handleClicks() {
        this.map.on('click', (e) => {
          var clicked_features = this.map.queryRenderedFeatures(e.point, {layers: ['localities']});
          clicked_features.forEach((f) => {
            const UniqLocCod = f.properties.UniqLocCod
            if (this.include) {
              if (this.included_localities.includes(UniqLocCod)) return
              this.included_localities.push(UniqLocCod)
            } else {
              if (this.excluded_localities.includes(UniqLocCod)) return
              this.excluded_localities.push(UniqLocCod)
            }

            // if (this.bulk_selected.includes(UniqLocCod)) {
            //   const index = this.bulk_selected.findIndex(i => i === UniqLocCod)
            //   this.bulk_selected.splice(index, 1)
            // } else {
            //   this.bulk_selected.push(UniqLocCod)
            // }
          })

          this.map.setFilter('single-included', ['in', 'UniqLocCod'].concat(this.included_localities))
          this.map.setFilter('single-excluded', ['!in', 'UniqLocCod'].concat(this.excluded_localities))
        })
      },
      toggle_mode() {
        this.include = !this.include
      }
    }
  }
</script>

<style lang="css" scoped>
  #map {
    /*height: 500px*/
  }
</style>