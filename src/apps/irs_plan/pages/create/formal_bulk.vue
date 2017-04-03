<template>
  <div>
    <p>Select risk level on slider: {{converted_slider_value}}</p>
  
    <input id="slider" type="range" ref='risk_slider' :min="slider.min" :max="slider.max" step="slider.step" v-model="risk_slider_value">
    <input type="range" min="0" max="1" step="0.01" v-model="raster_opacity">
    <div>
      <md-button @click.native='download_selected_clusters'>download clusters</md-button>
      <md-button @click.native='save_selected_clusters'>save clusters</md-button>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
  import {mapState, mapGetters} from 'vuex'
  import download from 'downloadjs'
  import debounce from 'lodash.debounce'

  import logslider from '../../../../lib/log_slider.js'

  export default {
    name: 'FormalBulk',
    data () {
      return {
        _map: null,
        risk_slider_value: 1,
        slider: {
          min: 1,
          max: 100,
          step: 1
        },
        raster_opacity: 0,
        logslider: null,

        // Result.vue
        _all_clusters: [],
        _selected_clusters: [],
        _selected_cluster_ids: [],
      }
    },
    computed: {
      ...mapGetters({
        'bulk_selected_ids': 'irs_plan:bulk_selected_ids',
        formal_area_ids: 'irs_plan:formal_area_ids',
        // Result.vue
        'all_selected_area_ids': 'irs_plan:all_selected_area_ids'
      }),
      ...mapState({
        country: state => state.meta.country,
        formal_areas: state => state.irs_plan.formal_areas,
        areas_included_by_click: state => state.irs_plan.areas_included_by_click,
        areas_excluded_by_click: state => state.irs_plan.areas_excluded_by_click,
      }),
      converted_slider_value() {
        if (!this.logslider) return 0

        let converted_value
        if (this.risk_slider_value === this.slider.min) {
          converted_value = 0
        } else {
          converted_value = this.logslider(this.risk_slider_value)
        }
        return converted_value
      }
    },
    mounted() {
      this.$store.dispatch("irs_plan:load_formal_areas").then(() => {
        this.create_map().then(() => {
          this.$store.dispatch('irs_plan:load_clusters').then((all_clusters) => {
            this._all_clusters = all_clusters
            this.add_clusters_layer()
            this.handle_cluster_change()
          })
        })
        this.add_locality_layers()
        this.add_risk_layer()
        this.handle_formal_area_click()
        
        this.set_slider_range()
        this.$refs.risk_slider.disabled = false
      })
    },
    activated() {
      if (this._map) this._map.resize()
    },
    watch: {
      'bulk_selected_ids': 'redraw_bulk_selected',
      'risk_slider_value': 'set_risk_slider_value',
      'raster_opacity': 'change_risk_opacity'
    },
    methods: {
      redraw_bulk_selected() {
        if (!this._map) return // slider can be moved and values change before map is drawn
        this._map.setFilter('bulk_included_layer', ['in', 'area_id'].concat(this.bulk_selected_ids))
        this._map.setFilter('bulk_excluded_layer', ['!in', 'area_id'].concat(this.bulk_selected_ids))
      },
      set_risk_slider_value: debounce(function(){
        this.$store.commit('irs_plan:set_risk_slider', this.converted_slider_value)
        this.handle_cluster_change()
      }, 750),
      change_risk_opacity() {
        this._map.setPaintProperty('risk', 'raster-opacity', parseFloat(this.raster_opacity))
      },
      set_slider_range() {
        const values_array = this.formal_areas.map(area => area.properties.MaxRisk).sort()
        const non_zeros = values_array.filter(v => v !== 0)

        const mino = Math.min(...non_zeros)
        const maxo = Math.max(...values_array) * 1.001
        this.logslider = logslider(this.slider.min, this.slider.max, mino, maxo)
      },
      create_map() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        return new Promise((resolve, reject) => {
          this._map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
            center: [this.country.centre.lng, this.country.centre.lat], // TODO: @refac Make it easier
            zoom: this.country.zoom
          });
          this._map.on('load', () => resolve())
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

        this._map.on('load', () => {
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
        })
      },
      handle_formal_area_click() {
        this._map.on('click', (e) => {
          const clicked_features = this._map.queryRenderedFeatures(e.point, {layers: ['formal_areas_layer']})
          if (clicked_features.length === 0) return
          const area_id = clicked_features[0].properties.area_id // Assume we only get a single feature

          this.$store.dispatch('irs_plan:area_click', area_id).then(() => {
            this._map.setFilter('single_included_layer', ['in', 'area_id'].concat(this.areas_included_by_click))
            this._map.setFilter('single_excluded_layer', ['in', 'area_id'].concat(this.areas_excluded_by_click))
            this.handle_cluster_change()
          })
        })
      },



      // Result.vue
      add_clusters_layer() {
        const all_clusters_fc = {
          type: 'FeatureCollection',
          features: this._all_clusters
        }
        this._map.addLayer({
          'id': 'clusters',
          'type': 'line',
          'source': {
            'type': 'geojson',
            'data': all_clusters_fc
          },
          'paint': {
            'line-color': 'blue'
          },
        })

      },
      handle_cluster_change: debounce(function(){
         this.$store.dispatch('irs_plan:calculate_selected_clusters', this._all_clusters).then((selected_clusters) => {
           this._selected_clusters = selected_clusters
           this._selected_cluster_ids = selected_clusters.map(cluster => cluster.properties.cluster_id)

           this.redraw_selected_clusters()
         })
      }, 750),
      redraw_selected_clusters() {
        if (this._map.getLayer('clusters')) {
          this._map.setFilter('clusters', ['in', 'area_id'].concat(this.all_selected_area_ids))
        }
      },
      download_selected_clusters() {
        const featureCollection = {
          type: 'FeatureCollection',
          features: this._selected_clusters
        }
        download(JSON.stringify(featureCollection), 'clusters.json', 'application/json') // TODO: @feature Add datestamp to download filename
      },
      save_selected_clusters() {
        debugger
        const cluster_ids = this._selected_cluster_ids
        const cluster_collection_id = this._selected_clusters[0].properties.cluster_collection_id
        const country_code = this.country.slug
        this.$store.dispatch('irs_plan:post_clusters', {cluster_ids, cluster_collection_id, country_code})
      }
    }
  }
</script>

<style lang="css" scoped>
  #slider {
    width: 90vw;
  }
</style>