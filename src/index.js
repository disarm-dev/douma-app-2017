// Some basics to get started
import 'whatwg-fetch'
import "babel-polyfill"

// CSS
import './fonts/Roboto.css'
import './fonts/MaterialIcons.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'survey-vue/survey.css'

// Imports
import Vue from 'vue'
import configureThemes from './config/theme'
import configureServiceWorker from './config/service-worker-client'
import create_router from './router'
import register_applets from './applets'
import DoumaComponent from './components/douma.vue'
import create_store from './store'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import {ClientTable} from 'vue-tables-2'
import {get_instance_config} from './lib/router-helper.js'
import add_network_status_watcher from './lib/network-status.js'
Vue.use(ClientTable)

// Keep track of Errors
if (process.env.NODE_ENV !== 'development') {
  Raven
    .config('https://05f42524abca4b84ba7a9b9d05fb620a@sentry.io/134727')
    .addPlugin(RavenVue, Vue)
    .install()
  Raven.setExtraContext({DOUMA_version: COMMIT_HASH})
}

// Vue generic setup
configureThemes()

const launch = (instance_config) => {
  if (Object.keys(instance_config.applets).length === 0) {
    throw new Error('No applets for current instance')
  }

  const applet_ids = Object.keys(instance_config.applets)
  const registered_applets = register_applets(applet_ids)

  let instance_routes = []
  for(var id in registered_applets.routes) {
    instance_routes.push(registered_applets.routes[id])
  }

  // Make DOUMA App
  const store = create_store(registered_applets.stores)
  const router = create_router(instance_routes, store)

  const douma_app = new Vue({
    el: '#douma',
    router,
    store,
    render: createElement => createElement(DoumaComponent),
  })

  douma_app.$store.commit('root:set_loading', false)
  douma_app.$store.commit('root:set_instance_config', instance_config)

  // ServiceWorker
  configureServiceWorker(douma_app)

  // Configure on/offline watcher
  add_network_status_watcher(douma_app)

  // Keep track of what version we're working on
  console.info('DOUMA version: ' + COMMIT_HASH)
}

get_instance_config()
  .then(instance_config => launch(instance_config))
  .catch(err => console.error(err))
