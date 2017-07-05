import Vue from 'vue'
import VueRouter from 'vue-router'

import {has_permission} from 'lib/permission_helper.js'

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

  // Is a user logged-in
  router.beforeEach((to, from, next) => {
    if (store.state.meta && store.state.meta.user) return next()

    if (to.name === 'meta:login') {
      next()
    } else {
      store.commit('meta/set_previous_route', to.path)
      next({name: 'meta:login'})
    }

  })

  // Does user have permission to visit page
  router.beforeEach((to, from, next) => {

    const applet = to.name.split(':')[0]

    if (has_permission({user: store.state.meta.user, applet})) {
      return next()
    } else {
      console.log('Not allowed to go to this page')
      return next(false)
    }

  })

  return router
}

