import Vue from 'vue'
import create_router from '../router'
import register_applets from '../applets'
import DoumaComponent from '../components/douma.vue'
import create_store from '../store'

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
  return douma_app
}