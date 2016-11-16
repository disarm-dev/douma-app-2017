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

let DUMA = Vue.component('app', App)
const handleTheme = (route) => {
  if (route.name.indexOf('foci') >= 0) {
    DUMA.theme = 'cyan'
  } else if (route.name.indexOf('irs') >= 0) {
    DUMA.theme = 'indigo'
  } else if (route.name.indexOf('cases') >= 0) {
    DUMA.theme = 'teal'
  } else {
    DUMA.theme = 'default'
  }
}

DUMA = new DUMA({router, store}).$mount('#app')

handleTheme(router.currentRoute)

router.afterEach((route) => {
  handleTheme(route)
})
