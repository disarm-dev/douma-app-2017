<template>
  <div class="tasks">
    <div class='md-title'>Targeting functionality can go here</div>
    <div class='md-body-1'>For example, adding targeting, tracking intervention activity and progress.</div>
    <div>Currently have {{$store.state.irs.structures.length}} structures loaded</div>
    <md-button v-if='$store.state.irs.structures.length === 0' @click='loadStructures'>Load tasks</md-button>
    <md-button v-else @click='unloadStructures'>Unload tasks</md-button>
  </div>
</template>

<script>
  // TODO: Remove the following line once we have got real data
  // import firebaseStructures from '../../../data_bootstrap/structures_5.json'
  import PouchDB from 'pouchdb'
  const structures = new PouchDB('structures')
  const actions = new PouchDB('actions')
  
  export default {
    data() {
      return {
        structures: [],
        actions: []
      }
    },
    methods: {
      loadStructures() {
        PouchDB.replicate('http://localhost:5984/structures', structures)
        PouchDB.replicate('http://localhost:5984/actions', actions)

        structures.allDocs({include_docs: true}).then(ss => {
          actions.allDocs({include_docs: true}).then(as => {
            this.structures = ss.rows.map(({doc}) => doc)
            this.actions = as.rows.map(({doc}) => doc)
            this.$store.commit('irs:loadStructures', {structures: this.structures, actions: this.actions})
          })
        })
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
