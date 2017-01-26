import {StructuresCollection, FociCollection} from '../../lib/models.js'

// TODO: @debug Remove bootstrapped data for dev
import fociExamples from '../../data_bootstrap/foci.json'
import firebaseStructures from '../../data_bootstrap/structures.json'

export default {
  state: {
    mapBounds: {}, // TODO: @feature Check if mapBounds needed here
    focis: new FociCollection(fociExamples),
    activeFoci: null,
    structures: new StructuresCollection(firebaseStructures),
  },
  actions: {},
  mutations: {
    // TODO: @refac Rename to setStructures
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
    }
  }
}