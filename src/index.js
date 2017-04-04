// fetch polyfill (needed for Safari only?)
import 'whatwg-fetch' // TODO: @refac Remove import for 'whatwg-fetch'

// Vue
import Vue from 'vue'

// CSS
import './fonts/Roboto.css'
import './fonts/MaterialIcons.css'
import 'mapbox-gl/dist/mapbox-gl.css'

// Imports
import configureThemes from './config/theme'
import configureServiceWorker from './config/service-worker'
import configureRouter from './router'
import Douma from './components/Douma.vue'
import store from './store'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import {ClientTable} from 'vue-tables-2';

// Keep track of Errors
Raven
  .config('https://05f42524abca4b84ba7a9b9d05fb620a@sentry.io/134727')
  .addPlugin(RavenVue, Vue)
  .install()
Raven.setExtraContext({DOUMA_version: COMMIT_HASH})

// Keep track of what version we're working on
console.info('DOUMA version: ' + COMMIT_HASH)

// Create a bunch of themes matching the routes
configureThemes()

Vue.use(ClientTable, {}, false);

// Make DOUMA App
const InitialiseDOUMA = Vue.component('douma', Douma)
const router = configureRouter()
const DOUMA = new InitialiseDOUMA({
  router, store
}).$mount('#douma')



// ServiceWorker
configureServiceWorker(DOUMA)
