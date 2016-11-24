import Vue from 'vue'
import Vuex from 'vuex'
import {find, findIndex} from 'lodash'
import {StructuresCollection, FociCollection} from './lib/models.js'

// TODO: Remove bootstrapped data for dev
import fociExamples from './bootstrap/foci.json'
import * as Helpers from './lib/helpers.js'

import firebaseStructures from './bootstrap/firebase_export.json'

const structuresArray = Helpers.firebaseObjectToArray(firebaseStructures)

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    foci: {
      mapBounds: {}, // TODO: Check if needed
      focis: new FociCollection(fociExamples),
      activeFoci: null,
      structures: new StructuresCollection(structuresArray),
    },
    irs: {
      structures: new StructuresCollection, // StructuresCollection
      activeStructure: null, // StructureModel from StructuresCollection
    }
  },
  mutations: {
    'foci:loadStructures': (state, structures) => {
      state.foci.structures = new StructuresCollection(structures)
    },
    'foci:setActiveFoci': (state, foci) => {
      state.foci.activeFoci = foci
    },
    'foci:setClassification': (state, classification) => {
      state.foci.activeFoci.properties.classification = classification
    },
    'foci:setMapBounds': (state, bounds) => {
      state.foci.mapBounds = bound
    },
    'foci:setResponses': (state, responses) => {
      state.foci.activeFoci.properties.responses = responses
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
      // TODO: findIndex is not always available, most likely due to Vuex, fix
      const index = state.irs.structures.findIndex(structureCopy)
      Vue.set(state.irs.structures.models, index, structureCopy)
    }
  }
})


export default store