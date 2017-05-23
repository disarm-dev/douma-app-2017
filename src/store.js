import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

function create_store(instance_stores) {
  return new Vuex.Store({
    modules: instance_stores,
    plugins: [createPersistedState()],
    state: {
      snackbar: {},
      loading: false,
      sw_message: {message: '', title: ''},
      instance_config: {}
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
          ['douma-user', 'douma-SWZ-ous', 'douma-ZWE-ous', 'douma-saved-cluster-ids', 'douma-country'].forEach(i => localStorage.setItem(i, null))
          context.commit('meta:login_user', null)
          location.reload()
        })

      },
    }
  })
}

export default create_store