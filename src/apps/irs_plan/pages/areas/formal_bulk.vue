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
        
        localities_included_by_click: [],
        localities_excluded_by_click: [],

        localities: [],
        localities_fc: null,
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
      all_uniq_loc_cods() {
        return this.localities.map(l => l.properties.UniqLocCod)
      }
    },
    mounted() {
      this.create_map()
      this.add_locality_layers()

      // TODO @debug creating an attribute to sort by
      this.localities = SWZ_ous.features.reverse().map((l, i) => {
        l.properties.risk = (i + 1)
        return l
      })
      this.localities_fc = {
        type: 'FeatureCollection',
        features: this.localities
      }
      this.bulk_selected = this.all_uniq_loc_cods

      this.add_click_handler()
    },
    watch: {
      'risk_slider_value': 'update_from_slider'
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
      update_from_slider() {
        if (this.map) {
          this.bulk_selected = this.localities.filter(l => l.properties.risk < (this.risk_slider_value + 1)).map(l => l.properties.UniqLocCod)
          this.map.setFilter('bulk-included', ['in', 'UniqLocCod'].concat(this.bulk_selected))
          this.map.setFilter('bulk-excluded', ['!in', 'UniqLocCod'].concat(this.bulk_selected))
        }
      },
      add_click_handler() {
        this.map.on('click', (e) => {
          const clicked_features = this.map.queryRenderedFeatures(e.point, {layers: ['localities']});

          clicked_features.forEach((f) => {
            const UniqLocCod = f.properties.UniqLocCod

            let include = !this.bulk_selected.includes(UniqLocCod)
            let arr_to_operate_on = include ? this.localities_included_by_click : this.localities_excluded_by_click

            if (arr_to_operate_on.includes(UniqLocCod)) {
              let index = arr_to_operate_on.findIndex(i => i === UniqLocCod)
              arr_to_operate_on.splice(index, 1)
            } else {
              arr_to_operate_on.push(UniqLocCod)
            }

          })

          this.map.setFilter('single-included', ['in', 'UniqLocCod'].concat(this.localities_included_by_click))
          this.map.setFilter('single-excluded', ['in', 'UniqLocCod'].concat(this.localities_excluded_by_click))
        })
      },
//      getLocalities() {
//        // TODO @debug fix when getting real attribute to sort by
//        return this.localities.slice(0, this.risk_slider_value).map(l => l.properties.UniqLocCod)
//      },
    }
  }
</script>

<style lang="css" scoped>
  #map {
    /*height: 500px*/
  }
</style>