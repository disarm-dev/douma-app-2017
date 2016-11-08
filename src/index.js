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

const DUMA = Vue.component('app', App)

const app = new DUMA({router, store}).$mount('#app')
