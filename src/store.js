import Vue from 'vue'
import Vuex from 'vuex'
import {Structures} from './lib/models.js'

import irs_progress from './apps/irs_progress/store'
import foci from './apps/foci'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {irs_progress, foci},
  state: {
    breadCrumbs: 'DOUMA',
    user: {name: 'Poor Original Bob', email: 'bob@bob.com'},
    online: null
  },
  mutations: {
    'meta:setOnline': (state, online) => {
      state.online = online
    }
  }
})


export default store