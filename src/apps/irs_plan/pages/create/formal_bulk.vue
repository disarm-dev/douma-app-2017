<template>
  <div>
    <p>Select risk level on slider: {{risk_slider_value}}</p>

    <input id="slider" type="range" ref='risk_slider' max="5" min="0" step="0.01" v-model="risk_slider_value">
    <!--<input type="range" min="0" max="1" step="0.01" v-model="raster_opacity">-->
    <div id="map"></div>
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
  import {mapState, mapGetters} from 'vuex'

  export default {
    name: 'FormalBulk',
    data () {
      return {
        _map: null,
        risk_slider_value: 0,
        raster_opacity: 0
      }
    },
    computed: {
      ...mapGetters({
        'bulk_selected_ids': 'irs_plan:bulk_selected_ids'
      }),
      ...mapState({
        country: state => state.meta.country,
        formal_areas: state => state.irs_plan.formal_areas,
        formal_area_ids: state => state.getters['irs_plan:formal_area_ids'],
        areas_included_by_click: state => state.irs_plan.areas_included_by_click,
        areas_excluded_by_click: state => state.irs_plan.areas_excluded_by_click,
      }),

    },
    mounted() {
      this.$store.dispatch("irs_plan:load_formal_areas").then(() => {
        this.create_map()
        this.add_locality_layers()
        console.log('risk layer disabled') // this.add_risk_layer()
        this.handle_formal_area_click()
        this.$nextTick(this.set_slider_range)
      })
    },
    activated() {
      if (this._map) this._map.resize()
    },
    watch: {
      'bulk_selected_ids': 'redraw_bulk_selected',
      'risk_slider_value': 'set_risk_slider_value',
      'raster_opacity': 'change_risk_opacity',
    },
    methods: {
      redraw_bulk_selected() {
        if (!this._map) return // slider can be moved and values change before map is drawn
        this._map.setFilter('bulk_included_layer', ['in', 'area_id'].concat(this.bulk_selected_ids))
        this._map.setFilter('bulk_excluded_layer', ['!in', 'area_id'].concat(this.bulk_selected_ids))
      },
      set_risk_slider_value() {
        this.$store.commit('irs_plan:set_risk_slider', this.risk_slider_value)
      },
      change_risk_opacity() {
        this._map.setPaintProperty('risk', 'raster-opacity', parseFloat(this.raster_opacity))
      },

      set_slider_range() {
        const values_array = this.formal_areas.map(area => area.properties.MaxRisk)
        this.$refs.risk_slider.min = Math.min(...values_array)
        this.$refs.risk_slider.max = Math.max(...values_array)
      },
      create_map() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        this._map = new mapboxgl.Map({
          container: 'map',
//          style: 'mapbox://styles/onyjsmith/cj0kre65k002k2slaemj9yy0f',
          style: 'mapbox://styles/onlyjsmith/cizxsvaqu00282rl3fdtv08dn',
          center: [this.country.centre.lng, this.country.centre.lat], // TODO: @refac Make it easier
          zoom: this.country.zoom
        })
      },
      add_locality_layers() {
        const formal_areas_fc = {
          type: 'FeatureCollection',
          features: this.formal_areas
        }

        this._map.on('load', () => {

          this._map.addLayer({
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

          this._map.addLayer({
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
            "filter": ['!in', 'area_id', '']
          })

          this._map.addLayer({
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
            "filter": ['in', 'area_id', '']
          })

          this._map.addLayer({
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

          this._map.addLayer({
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
            "filter": ['in', 'area_id', '']
          })

        })
      },
      add_risk_layer(){
        // TODO: @debug Remove these hard-coded values
        // TODO: @refac Change to risk api
        const date = '2015-04-01'
        const country_code = 'SWZ'
        const url = `https://storage.googleapis.com/pipeline-api/api/${country_code}/${date}/risk/standard/current-month/tiles/{z}/{x}/{y}.png`

        this._map.addLayer({
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
      handle_formal_area_click() {
        this._map.on('click', (e) => {
          const clicked_features = this._map.queryRenderedFeatures(e.point, {layers: ['formal_areas_layer']})
          const area_id = clicked_features[0].properties.area_id // Assume we only get a single feature

          this.$store.dispatch('irs_plan:area_click', area_id).then(() => {
            this._map.setFilter('single_included_layer', ['in', 'area_id'].concat(this.areas_included_by_click))
            this._map.setFilter('single_excluded_layer', ['in', 'area_id'].concat(this.areas_excluded_by_click))
          })
        })
      },
    }
  }
</script>

<style lang="css" scoped>
  #slider {
    width: 90vw;
  }
</style>