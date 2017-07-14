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

Vue.material.registerTheme({
  default: {
    primary: 'blue',
    accent: 'pink'
  }
})

import DoumaComponent from 'components/app.vue'
import {create_router} from '../router'
import {create_store} from '../store'
import {get_instance_stores_and_routes} from './applet_stores_and_routes'
import {instantiate_analytics, set_common_analytics} from 'config/analytics'
import {configure_spatial_helpers} from 'lib/spatial_hierarchy_helper'
import {configure_standard_handler} from 'lib/data/remote.standard-handler'

export function create_and_launch_application (instance_config) {
  // Configure spatial_helpers to use instance_config
  configure_spatial_helpers(instance_config)
  console.log('TODO: @idea 🤔 Can we start getting the tile-cover thing going here, to cache all needed vector tiles? https://github.com/mapbox/tile-cover')

  // Collect stores and routes for applets ONLY in this instance {stores: {}, routes: []}
  // Ignores user permissions
  const instance_applets_stores_and_routes = get_instance_stores_and_routes(instance_config)

  // Make Vuex#$store and a Vue#$router from what you got
  const store = create_store(instance_config, instance_applets_stores_and_routes.stores)
  const router = create_router(instance_applets_stores_and_routes.routes, store)

  // Configure standard_handler for remote requests
  configure_standard_handler(store)

  // Analytics 1/2: instantiate analytics before you create the application
  instantiate_analytics(router)

  // Instantiate Vue app with store and router
  const douma_app = new Vue({
    el: '#douma',
    router,
    store,
    render: createElement => createElement(DoumaComponent),
  })

  // Analytics 2/2: set common properties (e.g. user) for every event
  set_common_analytics(douma_app)

  return douma_app
}
