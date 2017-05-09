
// CSS
import './fonts/Roboto.css'
import './fonts/MaterialIcons.css'
import 'mapbox-gl/dist/mapbox-gl.css'

// Imports
import Vue from 'vue'
import configureThemes from './config/theme'
import configureServiceWorker from './config/service-worker'
import create_router from './router'
import register_applets from './applets'
import DoumaComponent from './components/douma.vue'
import create_store from './store'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import {ClientTable} from 'vue-tables-2'

// Keep track of Errors
Raven
  .config('https://05f42524abca4b84ba7a9b9d05fb620a@sentry.io/134727')
  .addPlugin(RavenVue, Vue)
  .install()
Raven.setExtraContext({DOUMA_version: COMMIT_HASH})

// Vue generic setup
configureThemes()
Vue.use(ClientTable, {}, false);


const launch = (instance_config) => {
  if (Object.keys(instance_config.applets).length === 0) {
    throw new Error('No applets for current instance')
  }

  const applet_ids = Object.keys(instance_config.applets)
  const registered = register_applets(applet_ids)

  let instance_routes = []
  for(var id in registered.routes) {
    instance_routes.push(registered.routes[id])
  }

  // Make DOUMA App
  const router = create_router(instance_routes)
  const store = create_store(registered.stores)

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

fetch(`/static/instances/${subdomain}.json`) // TODO: @refac Move this instance configuration from `static` to somewhere better
.then(res => {
  if (res.status === 404) {
    throw new Error(`Cannot find configuration file for ${subdomain}`)
  }
  return res.json()
}).then(json => { launch(json) })
