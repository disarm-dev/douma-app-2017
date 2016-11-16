<template>
  <div>
    <div class='md-title'>Targeting functionality can go here</div>
    <div class='md-body-1'>For example, adding targeting, tracking intervention activity and progress.</div>
    <div>Currently have {{loadedStructuresCount}} structures loaded</div>
    <md-button @click='loadStructures'>Load tasks</md-button>
  </div>
</template>

<script>
  import {slice } from 'lodash'
  import * as Helpers from '../../../lib/helpers.js'

  import {createStructuresCollection} from '../../../lib/models.js'
  import firebaseStructures from '../../../bootstrap/firebase_export.json'

  export default {
    computed: {
      loadedStructuresCount(){
        if (this.$store.state.irs.structures) {
          return this.$store.state.irs.structures.length
        } else {
          return 0
        }
      }
    },
    methods: {
      loadStructures() {
        let structuresArray = slice(Helpers.firebaseObjectToArray(firebaseStructures), 0, 50)
        structuresArray = createStructuresCollection(structuresArray)
        this.$store.commit('setIRSStructures', structuresArray)
      }
    }
  }


</script>
