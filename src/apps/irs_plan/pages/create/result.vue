<template>
  <div>
    <span>{{risk_slider}} clusters</span>
    <md-button @click.native="draw_localities()">draw localities</md-button>
    <md-button @click.native.stop="draw_clusters()">draw clusters</md-button>
    <md-button @click.native.stop='download_clusters'>dowload clusters</md-button>
    <div id="map"></div>
  </div>
</template>

<script>
  import MapboxGL from 'mapbox-gl/dist/mapbox-gl'
  import download from 'downloadjs'
  import turf from '@turf/turf'
  // import Localities from '../../localities.json'

  MapboxGL.accessToken = 'pk.eyJ1Ijoibmljb2xhaWRhdmllcyIsImEiOiJjaXlhNWw1NnkwMDJoMndwMXlsaGo5NGJoIn0.T1wTBzV42MZ1O-2dy8SpOw'

  export default {
    name: 'ResultMap',
    data() {
      return {
        clusters: [],
        map: null,
        risk_slider: 1,
      }
    },
    activated() {
      console.log('activated')
      this.draw_selected_area()

      if (this.map) this.map.resize()
    },
    mounted() {

      this.draw_map()
      this.draw_clusters()
    },
    methods: {
      download_clusters() {
        const filtered_clusters = this.clusters.features.filter(c => c.properties.cluster_id < this.risk_slider)
        const featureCollection = {
          type: 'FeatureCollection',
          features: filtered_clusters
        }
        const filtered_clusters_string = JSON.stringify(featureCollection)
        download(filtered_clusters_string, 'clusters.json', 'application/json')
      },
      draw_map() {
        this.map = new MapboxGL.Map({
          container: 'map', // container id
          style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
          center: [31.5, -26.50], // starting position
          zoom: 8 // starting zoom
        });

        this.map.on('render', e => {
          if (this.loading && this.map.loaded()) {
            this.$store.commit('root:set_loading', false)
            this.loading = false
          }
        })
      },
      find_areas() {
        const bulk_selected_area_ids = this.$store.getters['irs_plan:bulk_selected']
        
        // add included by click
        let bulk_selected_and_included_by_click = bulk_selected_area_ids.concat(this.$store.state.irs_plan.areas_included_by_click)

        // remove excluded by click
        this.$store.state.irs_plan.areas_excluded_by_click.forEach(area_id => {
          let index = bulk_selected_and_included_by_click.findIndex(a => a === area_id)
          if (index !== -1) {
            bulk_selected_and_included_by_click.splice(index, 1)    
          }
        })

        // the selected areas
        const result = bulk_selected_and_included_by_click

        return result
      },
      draw_selected_area() {
        // get bulk selected areas
        const res = this.find_areas()

        if (this.map.getLayer('clusters')) {
          console.log('set filter')
          this.map.setFilter('clusters', ['in', 'uniqloccod'].concat(res))
        }
        
      },
      draw_clusters() {
        // if (!this.map.loaded()) return

        this.map.on('load', () => {
          this.$store.commit('root:set_loading', true)
          this.loading = true

          fetch('/assets/swz.all-clusters.json')
          .then((res) => res.json())
          .then((clusters) => {
            this.$store.commit('root:set_loading', false)
            this.clusters = clusters

            let _cluster_layer = this.map.addLayer({
              'id': 'clusters',
              'type': 'line',
              'source': {
                'type': 'geojson',
                'data': clusters
              },
              'paint': {
                'line-color': 'blue'
              },
              'filter': ['in', 'uniqloccod'].concat(this.find_areas())
            })

          }).catch(console.log)
        })
      },
    }
  }
</script>

<style>
  #map {
    min-height: 80vh;
  }
</style>