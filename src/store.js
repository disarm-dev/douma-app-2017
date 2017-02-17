import Vue from 'vue'
import Vuex from 'vuex'
import {Structures} from './lib/models.js'

import irs_record from './apps/irs_record/store'
import foci from './apps/foci'
import meta from './apps/meta/store'

Vue.use(Vuex)

// Bootstrap user from localstorage
console.log('bootstrap user')
const user = JSON.parse(localStorage.getItem('douma-user'))

const store = new Vuex.Store({
  modules: {irs_record, foci, meta},
  state: {
  },
  mutations: {
  }
})


export default store