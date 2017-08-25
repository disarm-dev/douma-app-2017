import Vue from 'vue'
import VueRouter from 'vue-router'

import {has_permission} from 'lib/helpers/permission_helper.js'
import {geodata_valid} from 'lib/geodata/geodata.valid'

export function create_router(instance_routes, store) {
  Vue.use(VueRouter)

  // Configure routes for all Applets
  const routes = [
    {
      path: '/',
      redirect: '/meta',
    }
  ].concat(...instance_routes, {
    path: '*',
    redirect: '/'
  })

  // Instantiate `router`
  const router = new VueRouter({
    routes,
    mode: 'history'
  })

  // Check if user is logged-in
  router.beforeEach((to, from, next) => {
    // next() if user already logged in
    if (store.state.meta && store.state.meta.user) return next()

    // User not logged in
    if (to.name === 'meta:login') {
      // next() if destination is the login page
      return next()
    } else {
      // Otherwise go to the login page (storing your original target)
      store.commit('meta/set_previous_route', to.path)
      return next({name: 'meta:login'})
    }
  })

  router.beforeEach((to, from, next) => {

    // check if any applets require geodata, or continue
    const geodata_required = store.getters['meta/decorated_applets'].some(a => a.geodata_required)
    if (!geodata_required) return next()

    // if you're on your way to any 'meta' page, then carry on
    if (/^meta/.test(to.name)) return next()

    // geodata is required by at least one applet. check if it's already valid
    if (!geodata_valid()) {
      console.log('geodata required, NOT already exists && valid - go to a page to start getting geodata')
      store.commit('meta/set_previous_route', to.path)
      return next({name: 'meta:geodata'})
    } else {
      console.log('geodata required, already exists && valid')
      return next()
    }

  })

  // Check user has permission to visit page
  router.beforeEach((to, from, next) => {
    const applet_name = to.name.split(':')[0]

    if (has_permission({user: store.state.meta.user, applet_name})) {
      next()
    } else {
      next({name: 'meta:home'})
    }

  })

  return router
}

