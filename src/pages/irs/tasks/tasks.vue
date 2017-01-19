<template>
  <div class="tasks">
    <div class='md-title'>Targeting functionality can go here</div>
    <div class='md-body-1'>For example, adding targeting, tracking intervention activity and progress.</div>
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
        this.$store.commit('irs:reRenderMap')
        // structures.put({
        //   _id: '_design/areas',
        //   filters: {
        //     lubombo: function (doc) {
        //       return doc.area === 'lubombo';
        //     }.toString(),
        //     hhohho: function (doc) {
        //       return doc.area === 'hhohho';
        //     }.toString(),
        //     manzini: function (doc) {
        //       return doc.area === 'manzini';
        //     }.toString(),
            // shiselweni: function (doc) {
            //   return doc.area === 'shiselweni';
            // }.toString()
        //   }
        // }).then((err) => {
          // console.log(err)

          PouchDB.replicate('http://localhost:5984/structures', structures, {
            filter: 'areas/' + this.region
          }).then(() => {
            structures.find({selector: {area: this.region}}).then(({docs}) => {
              this.structures = docs
              let ids = this.structures.map(s => s.action).filter(id => id ? true : false)

              PouchDB.replicate('http://localhost:5984/actions', actions, {
                doc_ids: ids
              }).then(() => {
                actions.find({selector: {_id: {$in: ids}}}).then(({docs: secondDocs}) => {
                  this.actions = secondDocs
                  this.$store.commit('irs:loadStructures', {
                    structures: this.structures, 
                    actions: this.actions
                  })
                }).catch(err => console.log(err))
              }).catch(err => console.log(err))
            })
          }).catch(err => console.log(err))
        // })
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
  .structures {
    padding: 1em;
  }
</style>
