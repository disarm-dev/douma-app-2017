// CSS
import './fonts/Roboto.css'
import './fonts/MaterialIcons.css'
import 'mapbox-gl/dist/mapbox-gl.css'

// Imports
import Vue from 'vue'
import configureThemes from './config/theme'
import configureServiceWorker from './config/service-worker'
import configureRouter from './router'
import DoumaComponent from './components/douma.vue'
import store from './store'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import {ClientTable} from 'vue-tables-2'

// Keep track of Errors
Raven
  .config('https://05f42524abca4b84ba7a9b9d05fb620a@sentry.io/134727')
  .addPlugin(RavenVue, Vue)
  .install()
Raven.setExtraContext({DOUMA_version: COMMIT_HASH})


const launch = (instance_config) => {
  // Create a bunch of themes matching the routes
  configureThemes()

  Vue.use(ClientTable, {}, false);

  // Make DOUMA App
  const router = configureRouter()

  const douma_app = new Vue({
    el: '#douma',
    router, 
    store,
    render: createElement => createElement(DoumaComponent),
  })

  douma_app.$store.state.instance_config = instance_config

  // ServiceWorker
  configureServiceWorker(douma_app)

  // Keep track of what version we're working on
  console.info('DOUMA version: ' + COMMIT_HASH)
}

const subdomain = document.domain.split('.')[0]
console.log('subdomain', subdomain)

fetch(`/config/${subdomain}.json`).then(res => {
  if (res.status === 404) {
    throw new Error(`Cannot find configuration file for ${subdomain}`)
  }
  res.json() 
}).then(json => {
  launch(json)
})




