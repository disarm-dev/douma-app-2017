import Vue from 'vue'
import Vuex from 'vuex'

import irs_record from './apps/irs_record/store'
import irs_tasker from './apps/irs_tasker/store'
import irs_plan from './apps/irs_plan/store'
import irs_monitor from './apps/irs_monitor/store'
import meta from './apps/meta/store'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {irs_record, irs_tasker, irs_plan, irs_monitor, meta},
  state: {
  },
  mutations: {
  },
  actions: {
    'root:wipe_everything': (context) => {
      context.dispatch('irs_record:clear_local_dbs')
      localStorage.clear();
    }
  }
})

export default store