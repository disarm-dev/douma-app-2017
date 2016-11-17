import Vue from 'vue'
import Vuex from 'vuex'
import {find, findIndex} from 'lodash'
// TODO: Remove bootstrapped data for dev
import fociExamples from './bootstrap/foci.json'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    thematic_area: 'foci',
    mapBounds: {},
    focis: fociExamples,
    activeFoci: null,
    structures: {},
    irs: {
      structures: [],
      activeStructureId: null,
    }
  },
  mutations: {
    increase(state) {
      state.count++
    },
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
      setActiveIRSStructure
    },
    setActiveIRSStructure (state, structureId) {
      state.irs.activeStructureId = structureId
    },
    updateIRSStructure (state, updatedStructure) {
      console.log('updateIRSStructure')
      let structureToUpdate = find(state.irs.structures, (o) => o.id === updatedStructure.id) 
      structureToUpdate = updatedStructure
    }
  }
})


export default store