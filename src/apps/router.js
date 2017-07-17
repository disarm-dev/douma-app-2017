import Vue from 'vue'
import VueRouter from 'vue-router'

import {has_permission} from 'lib/helpers/permission_helper.js'

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
      next()
    } else {
      // Otherwise go to the login page (storing your original target)
      store.commit('meta/set_previous_route', to.path)
      next({name: 'meta:login'})
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

