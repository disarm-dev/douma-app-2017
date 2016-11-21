<template>
  <div class="tasks">
    <div class='md-title'>Targeting functionality can go here</div>
    <div class='md-body-1'>For example, adding targeting, tracking intervention activity and progress.</div>
    <div>Currently have {{structures.models.length}} structures loaded</div>
    <md-button v-if='structures.models.length === 0' @click='loadStructures'>Load tasks</md-button>
    <md-button v-else @click='unloadStructures'>Unload tasks</md-button>
  </div>
</template>

<script>
  // TODO: Remove the following 4? lines once we have got real data
  import {slice} from 'lodash'
  import firebaseStructures from '../../../bootstrap/firebase_export.json'
  import * as Helpers from '../../../lib/helpers.js'
  let structuresArray = slice(Helpers.firebaseObjectToArray(firebaseStructures), 0, 10)

  export default {
    computed: {
      structures() {
        return this.$store.state.irs.structures
      }
    },
    methods: {
      loadStructures() {
        // TODO: Figure real fetching of data
        this.$store.commit('irs:loadStructures', structuresArray)
      },
      unloadStructures() {
        this.$store.commit('irs:unloadStructures')
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
