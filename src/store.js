import Vue from 'vue'
import Vuex from 'vuex'
import {StructuresCollection, FociCollection, Structures} from './lib/models.js'

// TODO: Remove bootstrapped data for dev
import fociExamples from './data_bootstrap/foci.json'
import firebaseStructures from './data_bootstrap/structures.json'


Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    online: null,
    previousRoute: null,
    foci: {
      mapBounds: {}, // TODO: Check if needed
      focis: new FociCollection(fociExamples),
      activeFoci: null,
      structures: new StructuresCollection(firebaseStructures),
    },
    irs: {
      actions:[],
      mapReRenderCount: 0,
      structures: [], // StructuresCollection
      activeStructure: '', // StructureModel from StructuresCollection
      activeLayer: null
    }
  },
  mutations: {
    'meta:setOnline': (state, online) => {
      state.online = online
    },

    // TODO: Rename to setStructures
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

    'irs:reRenderMap': (state) => {
      state.irs.mapReRenderCount += 1
    },
    'irs:loadStructures': (state, {structures, actions}) => {
      state.irs.structures = Structures(structures, actions)
    },
    'irs:unloadStructures': (state) => {
      state.irs.structures = []
    },
    'irs:setActiveStructure': (state, structure) => {
      state.irs.activeStructure = structure
    },
    'irs:setActiveLayer': (state, layer) => {
      state.irs.activeLayer = layer
    },
    'irs:updateStructure': (state, {structure, action}) => {
      // TODO: findIndex is not always available, most likely due to Vuex, fix
      let index = state.irs.structures.findIndex((s) => s._id === structure._id)
      structure.actioned = action.actioned
      Vue.set(state.irs.structures, index, structure)
    }
  },
  getters: {
    'foci:activeFoci': (state) => {
      var id;
      if (!state.foci.activeFoci) return false
      if (state.foci.activeFoci.hasOwnProperty('id')) {
        id = state.foci.activeFoci.id
      } else {
        id = state.foci.activeFoci.properties.id
      }
      return {model: state.foci.focis.getModel(id), feature: state.foci.focis.getFeature(id)}
    },
    'foci.focis': (state) => {
      
    }
  }
})


export default store