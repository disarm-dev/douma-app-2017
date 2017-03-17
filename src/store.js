import Vue from 'vue'
import Vuex from 'vuex'

import irs from './apps/irs/store'
import irs_record from './apps/irs_record/store'
import irs_plan from './apps/irs_plan/store'
import irs_monitor from './apps/irs_monitor/store'

import rasters from './apps/rasters/store'

import meta from './apps/meta/store'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {irs, irs_record, irs_plan, irs_monitor, rasters, meta},
  state: {
    snackbar: {},
    loading: false,
    sw_message: {}
  },
  mutations: {
    'root:set_snackbar': (state, snackbar) => {
      state.snackbar = snackbar
    },
    'root:set_loading': (state, loading_bool) => {
      state.loading = loading_bool
    },
    'root:set_sw_message': (state, sw_message) => {
      state.sw_message = sw_message
    }
  },
  actions: {
    'root:wipe_everything': (context) => {
      context.dispatch('irs_record:clear_local_dbs').then(() => {
        // TODO: @refac Ok, good joke. Now remove this localStorage stuff
        ['douma-user', 'douma-SWZ-ous', 'douma-ZWE-ous', 'douma-saved-cluster-ids'].forEach(i => localStorage.setItem(i, null))
        context.commit('meta:login_user', null)
        location.reload()
      })

    },
  }
})

export default store