import Vue from 'vue'

// Components
import {ClientTable} from 'vue-tables-2'
Vue.use(ClientTable)

import VueTouch from 'vue-touch'
Vue.use(VueTouch)

import TreeView from "vue-json-tree-view"
Vue.use(TreeView)

import VueShortkey from 'vue-shortkey'
Vue.use(VueShortkey)

// VueMaterial
import VueMaterial from 'vue-material'
Vue.use(VueMaterial)


import DoumaComponent from 'components/app.vue'
import {create_router} from '../apps/router'
import {create_store} from '../apps/store'
import {get_instance_stores_and_routes} from './applet_stores_and_routes'
import {configure_theme} from './theme'
import {instantiate_analytics, set_common_analytics} from 'config/analytics'
import {configure_spatial_helpers} from 'lib/geodata/spatial_hierarchy_helper'
import {configure_standard_handler} from 'lib/remote/remote.standard-handler'
import {try_reconnect} from 'lib/remote/remote.standard-handler'

export function create_and_launch_application (instance_config) {

  // CREATE REQUIRED OBJECTS FOR APP (store AND router)

  // Collect stores and routes for applets ONLY in this instance {stores: {}, routes: []}
  // Ignores user permissions
  const instance_applets_stores_and_routes = get_instance_stores_and_routes(instance_config)

  // Make Vuex#$store and replace rehydrated (by vuex-persistedstate) instance_config with received instance_config
  // (Required for the app)
  const store = create_store(instance_config, instance_applets_stores_and_routes.stores)
  store.commit('root:set_instance_config', instance_config)

  // Create Vue#$router from what you got
  // (Required for the app)
  const router = create_router(instance_applets_stores_and_routes.routes, store)

  // Configure theme, either from default or instance_config
  configure_theme(instance_config)

  // BEFORE VUE APP IS CREATED (USING store OR router)

  // Configure spatial_helpers to use instance_config
  configure_spatial_helpers(instance_config)
  console.log('TODO: @idea 🤔 Can we start getting the tile-cover thing going here, to cache all needed vector tiles? https://github.com/mapbox/tile-cover')

  // Configure standard_handler for remote requests
  // Also trigger a ping to API, for lots of reasons, mostly that the API seems to take ages to wake up
  // (Loads of components use network requests when they are created/mounted)
  try_reconnect()
  configure_standard_handler(store)

  // Analytics 1/2: instantiate analytics before you create the application
  // (Vue injects $ga in every component)
  instantiate_analytics(router)


  // CREATE VUE APP

  // Instantiate Vue app with store and router
  const douma_app = new Vue({
    el: '#douma',
    router,
    store,
    render: createElement => createElement(DoumaComponent),
  })


  // AFTER VUE APP IS CREATED

  // Analytics 2/2: set common properties (e.g. user) for every event
  // (App needs to be running to send the first requests setting user props, etc)
  set_common_analytics(douma_app)

  return douma_app
}
