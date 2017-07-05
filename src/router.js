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

  // Add the guards
  router.beforeEach((to, from, next) => {
    if (!store.state.meta || !store.state.meta.user) {
      if (to.name === 'meta:login') {
        return next()
      } else {
        store.state.meta.previousRoute = to.path
        return next({name: 'meta:login'})
      }
    }

    if (has_permission({user: store.state.meta.user, page: to.name})) {
      next()
    } else {
      console.log('Not allowed to go to this page')
    }

    next()

  })

  return router;
}

