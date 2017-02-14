import Vue from 'vue'
import Vuex from 'vuex'
import {Structures} from './lib/models.js'

import irs_record from './apps/irs_record/store'
import foci from './apps/foci'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {irs_record, foci},
  state: {
    user: {
      name: 'Super Bob', 
      email: 'bob@bob.com', 
      team_id: 'disarm-swz-team',
      allowed_apps: {
        read: ['irs_review', 'irs_plan', 'irs_record'], 
        // write: ['irs_review', 'irs_plan', 'irs_record'], 
      }
    },
    online: null
  },
  mutations: {
    'meta:setOnline': (state, online) => {
      state.online = online
    }
  }
})


export default store