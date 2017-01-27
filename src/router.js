import Vue from 'vue'
import VueRouter from 'vue-router'

import EmptyContainer from './components/empty.vue'

import IRSRoutes from './apps/irs/routes'
import FociRoutes from './apps/foci/routes'
import GPSRoutes from './apps/gps/routes'
import MetaRoutes from './apps/meta/routes'
import CasesRoutes from './apps/cases/routes'


export default function getRouter(store) {

  const routes = [
    // ROOT redirects to the profile page, which lists out the apps 
    // available for the user to select
    {
      path: '/',
      redirect: '/profile',
      component: EmptyContainer,
      children: [].concat(IRSRoutes, FociRoutes, GPSRoutes, MetaRoutes, CasesRoutes)
    }
  ]

  Vue.use(VueRouter)

  const router = new VueRouter({
    routes,
    mode: 'history'
  })

  router.beforeEach((to, from, next) => {
    if (!store.state.user) {
      store.state.previousRoute = to
      if (to.name === 'meta:login') {
        return next()
      }
      return next({name: 'meta:login'})
    } 
    return next()
  })

  return router;
}



