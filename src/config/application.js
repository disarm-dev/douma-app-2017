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
import register_applets from './applets'
import DoumaComponent from 'components/douma.vue'
import create_store from '../store'

import {configure_analytics, configure_common_properties} from 'config/analytics'

export default (instance_config) => {
  // console.log('🌴 hunt the log', instance_config)

  if (Object.keys(instance_config.applets).length === 0) {
    throw new Error('No applets for current instance')
  }

  const applet_ids = Object.keys(instance_config.applets)
  const registered_applets = register_applets(applet_ids)

  let instance_routes = []
  for (var id in registered_applets.routes) {
    instance_routes.push(registered_applets.routes[id])
  }

  // Make store and router
  const store = create_store(registered_applets.stores)
  const router = create_router(instance_routes, store)

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
