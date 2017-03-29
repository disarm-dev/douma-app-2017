<template>
  <div>
    <md-button @click.native='download_selected_clusters'>download clusters</md-button>
    <div id="map"></div>
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
  import download from 'downloadjs'
  import {mapState} from 'vuex'

  export default {
    name: 'ResultMap',
    data() {
      return {
        clusters: [], // TODO: @refac Get rid of local clusters
        _map: null,
      }
    },
    computed: {
      ...mapState({
        country: state => state.meta.country
      })
    },
    mounted() {
      this.create_map()
      this.draw_clusters()
    },
    activated() {
      if (this.map) {
        this.draw_selected_clusters()
        this.map.resize()
      }
    },
    methods: {
      create_map() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        this.map = new mapboxgl.Map({
          container: 'map', // container id
          style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
          center: [this.country.centre.lng, this.country.centre.lat], // TODO: @refac Make it easier
          zoom: this.country.zoom
        });
      },
      draw_clusters() {
        this.map.on('load', () => {
          this.$store.commit('root:set_loading', true)

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

      download_selected_clusters() {
        const filtered_clusters = [] // TODO: @debug Actually get the right clusters: i.e. this.selected_clusters
        const featureCollection = {
          type: 'FeatureCollection',
          features: filtered_clusters
        }
        const filtered_clusters_string = JSON.stringify(featureCollection)
        download(filtered_clusters_string, 'clusters.json', 'application/json')
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
      draw_selected_clusters() {
        const res = this.find_areas()

        if (this.map.getLayer('clusters')) {
          this.map.setFilter('clusters', ['in', 'uniqloccod'].concat(res))
        }
      },
    }
  }
</script>

<style>
  #map {
    min-height: 80vh;
  }
</style>