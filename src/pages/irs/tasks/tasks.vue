<template>
  <div class="tasks">
    <div class='md-title'>Targeting functionality can go here</div>
    <div class='md-body-1'>For example, adding targeting, tracking intervention activity and progress.</div>
    <div>Currently have {{loadedStructuresCount}} structures loaded</div>
    <md-button v-if='loadedStructuresCount === 0' @click='loadStructures'>Load tasks</md-button>
    <md-button v-else @click='unloadStructures'>Unload tasks</md-button>
  </div>
</template>

<script>
  import {slice } from 'lodash'
  import * as Helpers from '../../../lib/helpers.js'
  import Leaflet from 'leaflet'
  import {createStructuresCollection} from '../../../lib/models.js'
  import MapHelpers from '../../../lib/map_helpers.js'
  import firebaseStructures from '../../../bootstrap/firebase_export.json'

  export default {
    data() {
      return {
        firebaseStructures
      }
    },
    computed: {
      loadedStructuresCount(){
        if (this.$store.state.irs.structures) {
          return this.$store.state.irs.structures.length
        } else {
          return 0
        }
      }
    },
    mounted() {
      // debugger
    },
    methods: {
      loadStructures() {
        // let structuresArray = slice(Helpers.firebaseObjectToArray(firebaseStructures), 0, 2)
        let structuresArray = Helpers.firebaseObjectToArray(firebaseStructures)
        structuresArray = createStructuresCollection(structuresArray)
        
        const structuresFeatureCollection = MapHelpers.buildFeatureCollection(this.$store.state.irs.structures)
        
        this.$store.commit('setIRSStructuresMapLayer', Leaflet.geoJson(structuresFeatureCollection))
        this.$store.commit('setIRSStructures', structuresFeatureCollection)
        alert('done loading')
      },
      unloadStructures() {
        this.$store.commit('unloadIRSStructures')
      }
    }
  }


</script>

<style scoped>
  .tasks {
    max-width: 800px;
    margin: 1em auto;
    padding: 1em;
  }
</style>
