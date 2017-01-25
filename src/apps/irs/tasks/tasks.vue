<template>
  <div class="tasks">
    <div class='md-title'>IRS Progress records</div>
    <div class="structures">
      <div>Currently have {{$store.state.irs.structures.length}} structure{{$store.state.irs.structures.length === 1 ? '' : 's'}} loaded</div>
      <div>{{actioned.length}} structure{{actioned.length ===  1 ? '' : 's'}} that {{actioned.length ===  1 ? 'has' : 'have'}} been actioned</div>
      <div>{{notActioned.length}} structure{{notActioned.length ===  1 ? '' : 's'}} that {{notActioned.length ===  1 ? 'has' : 'have'}} not been actioned</div>
    </div>


    <p>Please select a region below: </p>
    <md-input-container>
      <label for="region">Region</label>
      <md-select name="region" id="movie" v-model="region">
        <md-option value="hhohho">Hhohho</md-option>
        <md-option value="lubombo">Lubombo</md-option>
        <md-option value="manzini">Manzini</md-option>
        <md-option value="shiselweni">Shiselweni</md-option>
      </md-select>
    </md-input-container>
    <md-button v-if='$store.state.irs.structures.length === 0' @click='loadStructures' :disabled="!region">Load tasks</md-button>
    <md-button v-else @click='unloadStructures'>Unload tasks</md-button>
  </div>
</template>

<script>
  import {structures, actions} from '../../../db'

  export default {
    data() {
      return {
        structures: [],
        actions: [],
        region: ''
      }
    },
    computed: {
      actioned() {
        return this.$store.state.irs.structures.filter(({actioned}) => actioned)
      },
      notActioned() {
        return this.$store.state.irs.structures.filter(({actioned}) => !actioned)
      }
    },
    methods: {
      loadStructures() {
        // this.$store.commit('irs:reRenderMap')

        actions.list().then((res)=> {
          console.log(res)
        })
        // this.$store.commit('irs:loadStructures', {
        //   structures: this.structures, 
        //   actions: this.actions
        // })
      },
      unloadStructures() {
        this.$store.commit('irs:reRenderMap')
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
  .structures {
    padding: 1em;
  }
</style>
