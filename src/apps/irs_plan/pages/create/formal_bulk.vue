<template>
  <div>
    <p>Select risk level on slider</p>

    <vue-slider v-bind="slider_options" v-model="risk_slider_value" ref='slider'></vue-slider>
    <input type="range" min="0" max="1" step="0.01" v-model="raster_opacity">
    <div id="map"></div>
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
  import 'mapbox-gl/dist/mapbox-gl.css'

  import {mapState} from 'vuex'

  import vueSlider from 'vue-slider-component'


  export default {
    name: 'FormalBulk',
    components: {vueSlider},
    props: ['formal_areas', 'show_preview'],
    data () {
      return {
        map: null,
        
        localities_included_by_click: [],
        localities_excluded_by_click: [],

        localities: [],
        localities_fc: null,
        risk_slider_value: 0,
        slider_options: {
          min: 0,
          interval: 1,
          lazy: true,
          tooltipDir: 'top',
          // tooltip: 'always',
          formatter: '{value} local areas'
        },
        raster_opacity: 0
      }
    },
    computed: {
      ...mapState({
        formal_areas: state => state.irs_plan.formal_areas
      }),
      all_uniq_loc_cods() {
        return this.localities.map(l => l.properties.UniqLocCod)
      },
      bulk_selected() {
        return this.localities
          .filter(l => l.properties.risk < (this.risk_slider_value + 1)) // TODO: @debug remove when we are using risk (or proxy)
          .map(l => l.properties.UniqLocCod)
      },
      result_localities() {
        console.log('this.bulk_selected', this.bulk_selected)
        console.log('this.localities_included_by_click', this.localities_included_by_click)
        console.log('this.localities_excluded_by_click', this.localities_excluded_by_click)
        return {
          selected: this.bulk_selected,
          included: this.localities_included_by_click,
          excluded: this.localities_excluded_by_click
        }
      }
    },
    mounted() {
      // TODO @debug creating an attribute to sort by
      this.localities = this.formal_areas.reverse().map((l, i) => {
        l.properties.risk = (i + 1)
        return l
      })
      this.localities_fc = {
        type: 'FeatureCollection',
        features: this.localities
      }

      this.create_map()
      this.add_locality_layers()
//      this.add_risk_layer()
      console.log('risk layer disabled')
      this.add_click_handler()
    },
    activated() {
      if (this.map) this.map.resize()
    },
    watch: {
      'risk_slider_value': 'update_from_slider',
      'raster_opacity': 'change_risk_opacity',
      'formal_areas': 'set_slider'
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
      update_from_slider() {
        if (this.map) {
          this.map.setFilter('bulk-included', ['in', 'UniqLocCod'].concat(this.bulk_selected))
          this.map.setFilter('bulk-excluded', ['!in', 'UniqLocCod'].concat(this.bulk_selected))
        }
      },
      add_click_handler() {
        this.map.on('click', (e) => {
          const clicked_features = this.map.queryRenderedFeatures(e.point, {layers: ['localities']})

          // Assume we only get a single feature 
          const UniqLocCod = clicked_features[0].properties.UniqLocCod

          if (this.localities_included_by_click.includes(UniqLocCod)) {
            let index = this.localities_included_by_click.findIndex(i => i === UniqLocCod)
            this.localities_included_by_click.splice(index, 1)
          } else if (this.localities_excluded_by_click.includes(UniqLocCod)) {
            let index = this.localities_excluded_by_click.findIndex(i => i === UniqLocCod)
            this.localities_excluded_by_click.splice(index, 1)
          } else if (this.bulk_selected.includes(UniqLocCod)){
            this.localities_excluded_by_click.push(UniqLocCod)
          } else if (!this.bulk_selected.includes(UniqLocCod)) {
            this.localities_included_by_click.push(UniqLocCod)
          } else {
            console.log('should never see this')
          }


          this.map.setFilter('single-included', ['in', 'UniqLocCod'].concat(this.localities_included_by_click))
          this.map.setFilter('single-excluded', ['in', 'UniqLocCod'].concat(this.localities_excluded_by_click))
        })
      },
      change_risk_opacity() {
        this.map.setPaintProperty('risk', 'raster-opacity', parseFloat(this.raster_opacity))
      },
      set_slider() {
        console.log('set_slider', this.formal_areas.length)
        this.slider_options.max = this.formal_areas.length
      },
      add_locality_layers() {
        this.map.on('load', () => {

          this.map.addLayer({
            'id': 'localities', // every locality, doesn't change
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': this.localities_fc
            },
            'paint': {
              'fill-outline-color': 'grey',
              'fill-color': 'transparent',
            }
          }) 

          this.map.addLayer({
            'id': 'bulk-included',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': this.localities_fc
            },
            "paint":{
              'fill-outline-color': 'grey',
              'fill-color': '#a6dba0',
            },
            "filter": ['in', 'UniqLocCod'].concat(this.all_uniq_loc_cods)
          })

          this.map.addLayer({
            'id': 'bulk-excluded',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': this.localities_fc
            },
            "paint":{
              'fill-outline-color': 'grey',
              'fill-color': '#c2a5cf',
            },
            "filter": ['!in', 'UniqLocCod'].concat(this.all_uniq_loc_cods)
          })

          this.map.addLayer({
            'id': 'single-included',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': this.localities_fc
            },
            "paint":{
              'fill-outline-color': 'grey',
              'fill-color': '#008837',
            },
            "filter": ['in', 'UniqLocCod', '']
          })

          this.map.addLayer({
            'id': 'single-excluded',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': this.localities_fc
            },
            "paint":{
              'fill-outline-color': 'grey',
              'fill-color': '#7b3294',
            },
            "filter": ['!in', 'UniqLocCod'].concat(this.all_uniq_loc_cods)
          })

        })
      },
      add_risk_layer(){
        // TODO: @debug Remove these hard-coded values
        const date = '2015-04-01'
        const country_code = 'SWZ'
        const url = `https://storage.googleapis.com/pipeline-api/api/${country_code}/${date}/risk/standard/current-month/tiles/{z}/{x}/{y}.png`

        this.map.addLayer({
          id: "risk",
          type: "raster",
          source: {
            "type": "raster",
            "tiles": [url],
            "tileSize": 256,
            scheme: 'tms'
          },
          paint: {
            'raster-opacity': this.raster_opacity
          }
        })
      }
    }
  }
</script>

<style lang="css" scoped>
  #map {
    /*height: 500px*/
  }
</style>