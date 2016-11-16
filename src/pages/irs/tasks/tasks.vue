<template>
  <div>
    <div class='md-title'>Targeting functionality can go here</div>
    <div class='md-body-1'>For example, adding targeting, tracking intervention activity and progress.</div>

    <md-button>Load tasks</md-button>
  </div>
</template>

<script>
  import {slice } from 'lodash'
  import * as Helpers from '../../../lib/helpers.js'

  import {createStructures} from '../../../lib/models.js'
  import firebaseStructures from '../../../bootstrap/firebase_export.json'

  export default {
    mounted() {
      let structuresArray = slice(Helpers.firebaseObjectToArray(firebaseStructures), 0, 50)
      structuresArray = createStructures(structuresArray)
      this.$store.commit('setIRSStructures', structuresArray)
    }
  }


</script>
