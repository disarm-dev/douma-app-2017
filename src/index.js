// Vue
import Vue from 'vue'
import VueRouter from 'vue-router'

// Material CSS
import './fonts/Roboto.css'
import './fonts/MaterialIcons.css'

// Configuration and setup
import configureThemes from './config/theme'
import configureServiceWorker from './config/service-worker'
import configureRouter from './router'
import Douma from './components/Douma.vue'
import store from './store'

// Keep track of Errors
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

// TODO: @fix Get Raven working and sending errors, if we want error-reporting
Raven
  .config('https://05f42524abca4b84ba7a9b9d05fb620a@sentry.io/134727')
  .addPlugin(RavenVue, Vue)
  .install();

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
const router = configureRouter()
const DOUMA = new InitialiseDOUMA({
  router, store
}).$mount('#douma')

// ServiceWorker
configureServiceWorker()
