import Vue from 'vue'
import Vuex from 'vuex'
import {find, findIndex} from 'lodash'
// TODO: Remove bootstrapped data for dev
import fociExamples from './bootstrap/foci.json'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    foci: {
      mapBounds: {},
      focis: fociExamples,
      activeFoci: null,
      structures: {},
    },
    irs: {
      structures: null, // StructuresCollection ?
      activeStructure: null,
      activeIRSStructureMapLayer: null
      // activeStructure: {},
      // activeStructureMapLayer: {}
    }
  },
  getters: {
    activeStructure(state) {
      return state.irs.structures.findModelById(state.irs.activeStructure)
      // return find(state.irs.structures, o => o.id === state.irs.activeStructure)
    }
  },
  // actions: {
  //   setActiveIRSStructure() {
  //     // update the collection
  //     // recolour the layer
  //   }
  // },
  mutations: {
    setActiveFoci(state, fociId) {
      const index = findIndex(fociExamples.features, o => o.properties.id === fociId)
      state.activeFoci = fociExamples.features[index]
    },
    setClassification(state, classification) {
      state.activeFoci.properties.classification = classification
    },
    setMapBounds(state, bounds) {
      state.mapBounds = bounds
    },
    // IRS
    setIRSStructures(state, structures) {
      state.irs.structures = structures
    },
    unloadIRSStructures(state) {
      state.irs.structures = null
    },
    setActiveIRSStructure (state, layer) {
      var structureId
      if (typeof layer === 'object') {
        structureId = layer.feature.properties.id
      } else {
        structureId = layer
      }
      state.irs.activeStructure = structureId
    },
    updateIRSStructure (state, structure) {
      const index = findIndex(state.irs.structures, o => o.id === structure.id)
      state.irs.structures[index] = structure
    },
    actionStructure(state, id) {
      const index = findIndex(state.irs.structures, o => o.id === id)
      state.irs.structures[index].actioned = true
    }
  }
})


export default store