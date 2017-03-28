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
    data () {
      return {
        map: null,
        
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
        country: state => state.meta.country,
        formal_areas: state => state.irs_plan.formal_areas,
        formal_area_ids: state => state.getters['irs_plan:formal_area_ids'],
        localities_included_by_click: state => state.irs_plan.localities_included_by_click,
        localities_excluded_by_click: state => state.irs_plan.localities_excluded_by_click
      }),
      bulk_selected() {
        return
      },

    },
    mounted() {
      this.$store.dispatch("irs_plan:load_formal_areas", this.country.slug).then(() => {
        this.create_map()
        this.add_locality_layers()
        console.log('risk layer disabled') // this.add_risk_layer()
        this.add_click_handler()
      })
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
      update_from_slider() {
        this.$store.commit('irs_plan:set_risk_slider', this.risk_slider_value)

        if (this.map) {
          let bulk_selected = this.localities
            .filter(l => l.properties.risk < (this.risk_slider_value + 1))
            .map(l => l.properties.area_id)

          this.map.setFilter('bulk_included_layer', ['in', 'area_id'].concat(bulk_selected))
          this.map.setFilter('bulk_excluded_layer', ['!in', 'area_id'].concat(bulk_selected))
        }
      },
      change_risk_opacity() {
        this.map.setPaintProperty('risk', 'raster-opacity', parseFloat(this.raster_opacity))
      },
      set_slider() {
        console.log('set_slider', this.formal_areas.length)
        this.slider_options.max = this.formal_areas.length
      },

      create_map() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/onyjsmith/cj0kre65k002k2slaemj9yy0f',
          center: [31.50484892885717, -26.543508675283874],
          zoom: 7.34
        })
      },
      add_locality_layers() {
        const formal_areas_fc = {
          type: 'FeatureCollection',
          features: this.formal_areas
        }

        this.map.on('load', () => {

          this.map.addLayer({
            'id': 'formal_areas_layer', // every locality, doesn't change
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': formal_areas_fc
            },
            'paint': {
              'fill-outline-color': 'grey',
              'fill-color': 'transparent',
            }
          }) 

          this.map.addLayer({
            'id': 'bulk_included_layer',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': formal_areas_fc
            },
            "paint":{
              'fill-outline-color': 'grey',
              'fill-color': '#a6dba0',
            },
            "filter": ['in', 'area_id'].concat(this.formal_area_ids)
          })

          this.map.addLayer({
            'id': 'bulk_excluded_layer',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': formal_areas_fc
            },
            "paint":{
              'fill-outline-color': 'grey',
              'fill-color': '#c2a5cf',
            },
            "filter": ['!in', 'area_id'].concat(this.formal_area_ids)
          })

          this.map.addLayer({
            'id': 'single_included_layer',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': formal_areas_fc
            },
            "paint":{
              'fill-outline-color': 'grey',
              'fill-color': '#008837',
            },
            "filter": ['in', 'area_id', '']
          })

          this.map.addLayer({
            'id': 'single_excluded_layer',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': formal_areas_fc
            },
            "paint":{
              'fill-outline-color': 'grey',
              'fill-color': '#7b3294',
            },
            "filter": ['!in', 'area_id'].concat(this.formal_area_ids)
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
      },
      add_click_handler() {
        this.map.on('click', (e) => {
          const clicked_features = this.map.queryRenderedFeatures(e.point, {layers: ['formal_areas_layer']})

          // Assume we only get a single feature
          const area_id = clicked_features[0].properties.area_id

          this.$store.dispatch('irs_plan:locality_click', area_id)

          this.map.setFilter('single_included_layer', ['in', 'area_id'].concat(this.localities_included_by_click))
          this.map.setFilter('single_excluded_layer', ['in', 'area_id'].concat(this.localities_excluded_by_click))
        })
      },
    }
  }
</script>

<style lang="css" scoped>
  #map {
    /*height: 500px*/
  }
</style>