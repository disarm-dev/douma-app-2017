import Vue from 'vue'
import Vuex from 'vuex'
import {Structures} from './lib/models.js'

import irs_record from './apps/irs_record/store'
import irs_tasker from './apps/irs_tasker/store'
import irs_monitor from './apps/irs_monitor/store'
import foci from './apps/foci'
import meta from './apps/meta/store'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {irs_record, irs_tasker, irs_monitor, foci, meta},
  state: {
  },
  mutations: {
  }
})

export default store