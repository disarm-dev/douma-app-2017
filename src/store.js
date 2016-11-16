import Vue from 'vue'
import Vuex from 'vuex'
import {findIndex} from 'lodash'
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
      active: null,
    }
  },
  mutations: {
    increase(state) {
      state.count++
    },
    setActiveFoci(state, fociId) {
      const index = findIndex(fociExamples.features, (o) => {o.properties.id === fociId})
      state.activeFoci = fociExamples.features[index]
    },
    setClassification(state, classification) {
      state.activeFoci.properties.classification = classification
    },
    setMapBounds(state, bounds) {
      state.mapBounds = bounds
    },
    setIRSStructures(state, structures) {
      state.irs.structures = structures
    },
    setActiveIRSStructure(state, structureId) {
      const index = findIndex(state.irs.structures, (o) => {o.id === structureId})
      state.irs.active = state.irs.structures[index]
    },
    actionStructure(state, structureId) {
      const index = findIndex(state.irs.structures, (o) => {o.id === structureId})
      state.irs.structures[index].actioned = true
    }
  }
})


export default store