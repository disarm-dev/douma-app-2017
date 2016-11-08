import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    mapBounds: {},
    activeFoci: {}
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