<template>
  <div class="investigation-container">
    <div class="investigation-infobox">

      
      <div v-if="!editing && !viewing_suggestion">
        <md-button class="investigation-button md-raised" @click.native="previous_foci">
          <md-icon>keyboard_arrow_left</md-icon>
        </md-button>
        <md-button class="investigation-button md-raised" @click.native="next_foci">
          <md-icon>keyboard_arrow_right</md-icon>
        </md-button>
        <hr>
      </div>
      
      
      <div>
        <div class="md-title">Foci #{{foci.properties._id}}</div>
        <hr>
        <div class="md-subheading">Status: {{foci.properties.status}}</div>
        <div class="md-subheading">Structures: {{foci.properties.structures}}</div>
        <div class="md-subheading">Cases: {{foci.properties.cases}}</div>
      </div>

      <div v-if="!editing && !viewing_suggestion">
        <md-button class="md-raised md-accent" @click.native="editing = !editing">Edit</md-button>
        <md-button class="md-raised md-accent" v-if="foci.properties.suggested" @click.native="viewing_suggestion = !viewing_suggestion">View suggestion</md-button>
      </div>

      <div v-if="editing">
        <md-button class="md-raised md-accent" @click.native="save_cluster">Save</md-button>
      </div>

      <div v-if="viewing_suggestion">
        <md-button class="md-raised md-accent" @click.native="accept_suggestion">Accept suggestion</md-button>
        <md-button class="md-raised md-accent" @click.native="discard_suggestion">Discard suggestion</md-button>
        <md-button class="md-raised md-warn" @click.native="viewing_suggestion = !viewing_suggestion">Cancel</md-button>
      </div>
    </div>    
  
    <div id="map"></div>
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
  import {mapState, mapGetters} from 'vuex'
  import turf from '@turf/turf'
  import Vue from 'vue'

  export default {
    name: 'SingleFociMap',
    props: ['foci'],
    watch: {
      'foci': 'change_foci',
      'editing': 'toggle_draw'
    },
    mounted() {
      this.create_map().then(() => {
        this._map.resize()
        this.add_foci_layer()
        this.show_foci()
      })
    },
    data () {
      return {
        _map: null,
        _control: null,
        // state state
        editing: false,
        viewing_suggestion: false,
        layer_id: '',
      }
    },
    computed: {
      ...mapState({
        focis: state => state.foci.focis
      })
    },
    methods: {
      change_foci() {
        this.show_foci()
        this.toggle_draw()
      },


      create_map() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        return new Promise((resolve, reject) => {
          this._map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
            center: [31.92003, -26.21082],
            zoom: 16
          });
          this._map.on('load', () => resolve())
        })
      },
      add_foci_layer() {
        this._map.addLayer({
          'id': 'foci', 
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
      

      show_foci() {
        if (this._map && this._map.getLayer('foci')) {
          this._map.setFilter('foci', ['==', '_id', this.foci.properties._id])
          let centroid = turf.centroid(this.foci)
          this._map.panTo(centroid.geometry.coordinates)
        }
      },
      toggle_draw() {
        if (this.editing) {
          this._control = new MapboxDraw();
          this._map.addControl(this._control)
          let ids = this._control.add(this.foci)
          this.layer_id = ids[0];
        } else {
          this._map.removeControl(this._control)
        }
      },
      remove_foci_layer() {
        if (this._map.getLayer('foci')) {
          this._map.removeLayer('foci')
          this._map.removeSource('foci')
        }
      },

      save_cluster() {        
        let polygon = this._control.get(this.layer_id)
        delete polygon.id
        
        this.remove_foci_layer()
        this._control.delete([this.layer_id])

        this.$store.commit('foci:update_foci', polygon)
        this.editing = false

        this.add_foci_layer()
        this.show_foci()
      },

      accept_suggestion() {
        this.$store.dispatch('foci:accept_suggestion', this.foci)
        this.viewing_suggestion = false
      },
      discard_suggestion() {
        this.$store.dispatch('foci:disard_suggestion', this.foci)
        this.viewing_suggestion = false
      },
      

      //
      // Navigating to next or previous foci
      //
      next_foci() {
        let current_index = this.focis.findIndex(f => f.properties._id == this.foci.properties._id)
        if (current_index + 1 === this.focis.length) {
          let foci_id = this.focis[0].properties._id
          this.$router.push({name: 'foci:investigation', params: {foci_id}})
        } else {
          let foci_id = this.focis[current_index + 1].properties._id
          this.$router.push({name: 'foci:investigation', params: {foci_id}})
        }
      },
      previous_foci() {
        let current_index = this.focis.findIndex(f => f.properties._id == this.foci.properties._id)
        if (current_index - 1 === -1) {
          let foci_id = this.focis[this.focis.length - 1].properties._id
          this.$router.push({name: 'foci:investigation', params: {foci_id}})
        } else {
          let foci_id = this.focis[current_index - 1].properties._id
          this.$router.push({name: 'foci:investigation', params: {foci_id}})
        }
      }
    }

  }
</script>

<style scoped>
  #map {
    height: calc(100vh - 64px)
  }

  .investigation-container {
    position: relative;
  }

  .investigation-infobox {
    position: absolute;
    z-index: 1;
    right: 0px;
    top: 0px;
    left: 0px;

    background-color: white;
    padding: 1em;
  }

  .investigation-button {
    width: calc(49% - 16px);
  }

  @media (min-width: 600px) {
    .investigation-infobox {
      left: auto;
      top: auto;
      right: 50px;
      bottom: 60px;
      width: 300px;
    }  
  }

  .md-tab{
    padding: 0 !important;
  }
</style>