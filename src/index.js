import Vue from 'vue'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'
import './fonts/Roboto.css'
import './fonts/MaterialIcons.css'

import configure from './config'
import App from './components/App.vue'
import router from './router'
import store from './store'

configure()

sync(store, router)

let DOUMA = Vue.component('app', App)
const handleTheme = (route) => {
  if (route.name.indexOf('foci') >= 0) {
    DOUMA.theme = 'cyan'
  } else if (route.name.indexOf('irs') >= 0) {
    DOUMA.theme = 'indigo'
  } else if (route.name.indexOf('cases') >= 0) {
    DOUMA.theme = 'teal'
  } else {
    DOUMA.theme = 'default'
  }
}

DOUMA = new DOUMA({router, store}).$mount('#app')

handleTheme(router.currentRoute)

router.afterEach((route) => {
  handleTheme(route)
})
