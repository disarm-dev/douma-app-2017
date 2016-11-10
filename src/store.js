import Vue from 'vue'
import Vuex from 'vuex'

// TODO: Remove bootstrapped data for dev
import fociExamples from './bootstrap/foci.json'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    mapBounds: {},
    focis: fociExamples,
    activeFoci: '',
    structures: {}
  },
  mutations: {
    increase(state) {
      state.count++
    },
    setActiveFoci(state, foci) {
      state.activeFoci = foci
    },
    setMapBounds(state, bounds) {
      state.mapBounds = bounds
    }
  }
})


export default store