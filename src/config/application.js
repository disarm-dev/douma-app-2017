import Vue from 'vue'

// Components
import {ClientTable} from 'vue-tables-2'
Vue.use(ClientTable)
import VueTouch from 'vue-touch'
Vue.use(VueTouch)

// VueMaterial
import VueMaterial from 'vue-material'
Vue.use(VueMaterial)
import 'vue-material/dist/vue-material.css'

Vue.material.registerTheme({
  default: {
    primary: 'blue',
    accent: 'pink'
  }
})


import create_router from '../router'
import {get_instance_stores_and_routes} from './applets'
import DoumaComponent from 'components/douma.vue'
import create_store from '../store'

import {configure_analytics, configure_common_properties} from 'config/analytics'

export default (instance_config) => {
  // console.log('🌴 hunt the log', instance_config)

  if (Object.keys(instance_config.applets).length === 0) {
    throw new Error('No applets for current instance')
  }

  const instance_applet_ids = Object.keys(instance_config.applets)
  const instance_applets_stores_and_routes = get_instance_stores_and_routes(instance_applet_ids)
  console.log(instance_applets_stores_and_routes)
  
  // Get the routes for this instance. e.g. routes for SWZ
  let instance_routes_array = []
  for (const applet_name in instance_applets_stores_and_routes.routes) {
    instance_routes_array.push(instance_applets_stores_and_routes.routes[applet_name])
  }
  console.log(instance_routes_array)

  // Make store and router
  const store = create_store(instance_applets_stores_and_routes.stores)
  const router = create_router(instance_routes_array, store, instance_config)

  // Analytics 1/2 (see below)
  configure_analytics(router)

  // Instantiate Vue app
  const douma_app = new Vue({
    el: '#douma',
    router,
    store,
    render: createElement => createElement(DoumaComponent),
  })

  // Analytics 2/2 - set common properties
  configure_common_properties(douma_app)

  douma_app.$store.commit('root:set_loading', false)
  douma_app.$store.commit('root:set_instance_config', instance_config)
  return douma_app
}
