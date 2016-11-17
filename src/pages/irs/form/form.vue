<template>
  <div>
    <div v-if="!structureCopy">
      <no-active-structure />
    </div>

    <div v-else class="form">
      <div class="md-title">Structure: {{structureCopy.id}}</div>

      <form novalidate @submit.stop.prevent="submit">

        <md-input-container>
          <label>Actioned by</label>
          <md-input v-model="structureCopy.actionBy"></md-input>
        </md-input-container>

        <md-input-container>
          <label>Date</label>
          <md-input type="date" v-model="structureCopy.date"></md-input>
        </md-input-container>

        <md-input-container>
          <label>Time</label>
          <md-input type="time" v-model="structureCopy.time"></md-input>
        </md-input-container>
        
        <div>
          <md-checkbox v-model="structureCopy.actioned">Actioned?</md-checkbox>
        </div>

        <md-button @click="submit" type="submit" class="md-raised md-accent">Save</md-button>
      </form>
    </div>
  </div>
</template>

<script>
  import {find, findIndex} from 'lodash'

  import NoActiveStructure from '../../../components/no-active-structure.vue'

  export default {
    data(){
      return {
        structure: null
    //     structureCopy() {
    //       return {...find(this.$store.state.irs.structures,
    //         o => o.id === this.$store.state.irs.activeStructureId
    //       )}

    // //       find(this.$store.state.irs.structures,
    // //         o => o.id === this.$store.state.irs.activeStructureId
    // //       )  
    //     }
      }
    },
    components: {
      NoActiveStructure
    },
    computed: {
      // actionedCopy: {
      //   get () {
      //     return find(this.$store.state.irs.structures,
      //                 o => o.id === this.$store.state.irs.activeStructureId
      //     ).actioned

      //   },
      //   set(val){
      //     return val
      //   }
      // },
      structureCopy: {
        get () {
          return this.structure = {...find(this.$store.state.irs.structures,
            o => o.id === this.$store.state.irs.activeStructureId
          )}
        },
        set (structureChanged) {
          console.log('changed')
          this.structure = structureChanged
        }
      }
    },
    methods: {
      submit(e) {
        console.log(this.structureCopy)
        this.$store.commit('updateIRSStructure', this.structureCopy)
        history.back()
      }
    }
  }
</script>

<style scoped>
  .form {
    max-width: 800px;
    margin: 1em auto;
    padding: 1em;
  }
</style>