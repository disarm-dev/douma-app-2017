import {Structures} from '../../lib/models.js'

export default {
  state: {
    actions: [],
    mapReRenderCount: 0,
    structures: [], // StructuresCollection
    activeStructure: '', // StructureModel from StructuresCollection
    activeLayer: null
  },
  mutations: {
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
    'irs:updateStructure': (state, {structure, action }) => {
      // FIXME: findIndex is not always available, most likely due to Vuex, fix
      let index = state.irs.structures.findIndex((s) => s._id === structure._id)
      structure.actioned = action.actioned
      Vue.set(state.irs.structures, index, structure)
    },
    random: state => console.log(state)
  },
  actions: {}
}