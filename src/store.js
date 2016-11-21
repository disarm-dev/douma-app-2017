import Vue from 'vue'
import Vuex from 'vuex'
import {find, findIndex} from 'lodash'
// TODO: Remove bootstrapped data for dev
import fociExamples from './bootstrap/foci.json'
import StructuresCollection from './lib/models.js'

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
      structures: new StructuresCollection, // StructuresCollection
      activeStructure: null, // StructureModel from StructuresCollection
    }
  },
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

    'irs:loadStructures': (state, structures) => {
      state.irs.structures = new StructuresCollection(structures)
    },
    'irs:unloadStructures': (state) => {
      state.irs.structures = new StructuresCollection
    },
    'irs:setActiveStructure': (state, structure) => {
      state.irs.activeStructure = structure
    },
    'irs:updateStructure': (state, structureCopy) => {
      const index = state.irs.structures.findIndex(structureCopy)
      Vue.set(state.irs.structures.models, index, structureCopy)
    },
    'irs:actionStructure': (state, id) => {
      const index = state.irs.structures.models.findIndex(o => o.id === id)
      var structure = Object.assign({}, state.irs.structures.models[index])
      structure.actioned = true
      Vue.set(state.irs.structures.models, index, structure)
    }
  }
})


export default store