// Vue
import Vue from 'vue'
import VueRouter from 'vue-router'

// Material CSS
import './fonts/Roboto.css'
import './fonts/MaterialIcons.css'

// Configuration and setup
import configureThemes from './config/theme'
import Douma from './components/Douma.vue'
import {createRouter} from './router'
import store from './store'
import configureServiceWorker from './config/service-worker'

// Keep track of what version we're working on
console.info('DOUMA version: ' + COMMIT_HASH)

// Create some very useful and simple global storage, especially for Maps
// TODO: @refac Replace `douma.data` global with something else. Another global of some kind?
window.douma = {
    data: {
      irs_progress: {
        entities: [],
        entitiesLayer: null,

        // Leaflet Map
        leMap: null,
        userCoordsMarker: null,
      }
    }
}

// Create a bunch of themes matching the routes
configureThemes()

// Make DOUMA App
const InitialiseDOUMA = Vue.component('douma', Douma)
const router = createRouter()
const DOUMA = new InitialiseDOUMA({
  router, store
}).$mount('#douma')


configureServiceWorker()
