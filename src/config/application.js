import Vue from 'vue'

// Components
import {ClientTable} from 'vue-tables-2'
Vue.use(ClientTable)
import VueTouch from 'vue-touch'
Vue.use(VueTouch)

// VueMaterial
import VueMaterial from 'vue-material'
Vue.use(VueMaterial)

Vue.material.registerTheme({
  default: {
    primary: 'blue',
    accent: 'pink'
  }
})

import DoumaComponent from 'app.vue'
import {create_router} from '../router'
import {create_store} from '../store'
import {get_instance_stores_and_routes} from './applets'
import {instantiate_analytics, set_common_analytics} from 'config/analytics'

export function configure_application (instance_config) {
  // TODO: @refac Do better checking of instance config e.g. at/before deploy

  // Collect stores and routes for applets ONLY in this instance {stores: {}, routes: []}
  const instance_applets_stores_and_routes = get_instance_stores_and_routes(instance_config)

  // Make Vuex#$store and a Vue#$router from what you got
  const store = create_store(instance_applets_stores_and_routes.stores)
  const router = create_router(instance_applets_stores_and_routes.routes, store)

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
