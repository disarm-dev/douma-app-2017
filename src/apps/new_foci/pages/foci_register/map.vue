<template>
  <div id="map"></div>
</template>

<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
  import {mapState, mapGetters} from 'vuex'

  export default {
    name: 'FociMap',
    watch: {
    },
    activated() {

    },
    created() {
    },
    mounted() {
      this.create_map().then(() => {
        console.log('created')
        this._map.resize()
        this.add_foci_layer()
        this.handle_click()
      })
    },
    data () {
      return {
        _map: null
      }
    },
    computed: {
      ...mapState({
        focis: state => state.foci.focis
      })
    },
    methods: {
      create_map() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        return new Promise((resolve, reject) => {
          this._map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
            center: [31.923161916863137, -26.210573497946406],
            zoom: 15.374
          });
          this._map.on('load', () => resolve())
        })
      },
      add_foci_layer() {
        console.log(this.focis)
        this._map.addLayer({
          'id': 'focis', // every locality, doesn't change
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': {type: 'FeatureCollection', features: this.focis }
          },
          'paint': {
            'fill-outline-color': 'grey',
            'fill-opacity': 0.5,
            'fill-color': {
                property: 'status',
                type: 'categorical',
                stops: [
                    ['Active', '#F44336'],
                    ['Inactive', '#FF9800'],
                    ['Cleared', '#4CAF50']
                ]
            }
          }
        }) 
      },
      handle_click() {
        this._map.on('click', (e) => {
          const clicked_features = this._map.queryRenderedFeatures(e.point, {layers: ['focis']})
          if (clicked_features.length === 0) return
          const foci_id = clicked_features[0].properties._id // Assume we only get a single feature
          this.$router.push({name: 'foci:investigation', params: {foci_id: foci_id}})
        })        
      }
    }

  }
</script>

<style>.md-tab{padding: 0 !important;}</style>