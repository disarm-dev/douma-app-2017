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
        _all_clusters: [],
        _selected_clusters: [],
        _selected_cluster_ids: [],
      }
    },
    computed: {
      ...mapState({
        country: state => state.meta.country,
      }),
      ...mapGetters({
        all_selected_area_ids: 'irs_plan:all_selected_area_ids'
      })
    },
    mounted() {
      this.$store.dispatch('irs_plan:load_clusters').then((all_clusters) => {
        this._all_clusters = all_clusters
        this.create_map().then(() => {
          this.add_clusters_layer()
          this.handle_cluster_change()
        })
      })
    },
    activated() {
      if (this._map.loaded()) {
        this.handle_cluster_change()
        this._map.resize()
      }
    },
    methods: {
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
//          'filter': ['in', 'area_id', '']
        })

      },

      handle_cluster_change() {
        this.$store.dispatch('irs_plan:calculate_selected_clusters', this._all_clusters).then((selected_clusters) => {
          console.log('set selected_clusters', selected_clusters.length)
          this._selected_clusters = selected_clusters
          this._selected_cluster_ids = selected_clusters.map(cluster => cluster.properties.cluster_id)

          this.redraw_selected_clusters()
        })
      },
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
        const cluster_ids = this._selected_cluster_ids
        const cluster_collection_id = this._selected_clusters[0].properties.cluster_collection_id
        this.$store.dispatch('irs_plan:post_clusters', {cluster_ids, cluster_collection_id})
      }
    }
  }
</script>

<style>
  #map {
    min-height: 80vh;
  }
</style>