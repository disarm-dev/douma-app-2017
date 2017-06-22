import Vue from 'vue'
import VueRouter from 'vue-router'

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

    console.warn("TODO: @feature Check if user authorised for route")

    next()

  })

  return router;
}

