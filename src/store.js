import Vue from 'vue'
import Vuex from 'vuex'
import {find, findIndex} from 'lodash'
// TODO: Remove bootstrapped data for dev
import fociExamples from './bootstrap/foci.json'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    mapBounds: {},
    focis: fociExamples,
    activeFoci: null,
    structures: {},
    irs: {
      structures: [],
      activeStructureId: null,
      activeIRSStructureMapLayer: null
      // activeStructure: {},
      // activeStructureMapLayer: {}
    }
  },
  getters: {
    activeStructure(state) {
      return find(state.irs.structures, o => o.id === state.irs.activeStructureId)
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
      state.irs.structures = []
    },
    setActiveIRSStructure (state, layer) {
      if(layer) {
        const structureId = layer.feature.properties.id
      }
      state.irs.activeStructureId = structureId
      state.irs.activeIRSStructureMapLayer = Object.assign({}, layer)
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