import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    },
    decrement(state) {
      state.count--
    }
  },
  actions: {
    increase({state, commit}) {
      commit('increment', 1)
    },
    decrease({state, commit}) {
      commit('decrement')
    }
  }
})


export default store