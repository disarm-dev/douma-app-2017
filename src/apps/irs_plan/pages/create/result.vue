<template>
  <div>
    <md-button @click.native='download_selected_clusters'>download clusters</md-button>
    <md-button @click.native='save_selected_clusters'>save clusters</md-button>
    <div id="map"></div>
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
  import download from 'downloadjs'
  import {mapState, mapGetters} from 'vuex'

  export default {
    name: 'ResultMap',
    data() {
      return {
        _map: null,
      }
    },
    computed: {
      ...mapState({
        country: state => state.meta.country,
        all_clusters: state => state.irs_plan.all_clusters
      }),
      ...mapGetters({
        selected_cluster_ids: 'irs_plan:selected_cluster_ids',
        selected_clusters: 'irs_plan:selected_clusters',
      })
    },
    mounted() {
      this.$store.dispatch('irs_plan:load_clusters').then(() => {
        this.create_map()
        this.add_clusters_layer()
      })
    },
    activated() {
      if (this._map) {
        this.redraw_selected_clusters()
        this._map.resize()
      }
    },
    methods: {
      create_map() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        this._map = new mapboxgl.Map({
          container: 'map', // container id
          style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
          center: [this.country.centre.lng, this.country.centre.lat], // TODO: @refac Make it easier
          zoom: this.country.zoom
        });
      },
      add_clusters_layer() {
        const all_clusters_fc = {
          type: 'FeatureCollection',
          features: this.all_clusters
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
          'filter': ['in', 'area_id', '']
        })
      },

      redraw_selected_clusters() {
        if (this._map.getLayer('clusters')) {
          this._map.setFilter('clusters', ['in', 'area_id'].concat(this.selected_cluster_ids))
        }
      },

      download_selected_clusters() {
        const featureCollection = {
          type: 'FeatureCollection',
          features: this.selected_clusters
        }
        download(JSON.stringify(featureCollection), 'clusters.json', 'application/json') // TODO: @feature Add datestamp to download filename
      },
      save_selected_clusters() {
        this.$store.dispatch('irs_plan:post_clusters')
      }
    }
  }
</script>

<style>
  #map {
    min-height: 80vh;
  }
</style>