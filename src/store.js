import Vue from 'vue'
import Vuex from 'vuex'
import {Structures} from './lib/models.js'

import irs_record from './apps/irs_record/store'
import foci from './apps/foci'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {irs_record, foci},
  state: {
    user: null,
    team_id: null,
    online: null
  },
  mutations: {
    'meta:login_user': (state, user) => {
      state.user = user
    },
    'meta:set_team_id': (state, team_id) => {
      state.team_id = team_id
    },
    'meta:setOnline': (state, online) => {
      state.online = online
    },
    'meta:toast': (state, toast) => {
      state.toast = toast
    }
  }
})


export default store