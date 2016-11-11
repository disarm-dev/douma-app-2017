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
    structures: {}
  },
  mutations: {
    increase(state) {
      state.count++
    },
    setActiveFoci(state, fociId) {
      const index = findIndex(fociExamples.features, (o) => o.properties.id === fociId)
      state.activeFoci = fociExamples.features[index]
    },
    setMapBounds(state, bounds) {
      state.mapBounds = bounds
    }
  }
})


export default store