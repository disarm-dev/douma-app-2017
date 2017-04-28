import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import store from './store'

import IRSMonitorRoutes from './apps/irs_monitor/routes'
import IRSPlanningRoutes from './apps/irs_plan/routes'
import IRSRecordRoutes from './apps/irs_record/routes'
import IRSTaskerRoutes from './apps/irs_tasker/routes'
import NewFociRoutes from './apps/new_foci/routes'
// import FociRoutes from './apps/foci/routes'
// import GPSRoutes from './apps/gps/routes'
import RastersRoutes from './apps/rasters/routes'

import MetaRoutes from './apps/meta/routes'
// import CasesRoutes from './apps/cases/routes'

export default () => {
  // Configure routes for all Applets
  const routes = [
    {
      path: '/',
      redirect: '/meta',
    }
  ].concat(IRSMonitorRoutes, IRSPlanningRoutes, IRSTaskerRoutes, IRSRecordRoutes, RastersRoutes, MetaRoutes, NewFociRoutes, {
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
    // console.log(to, from)
    if (!store.state.meta.user) {
      store.state.meta.previousRoute = to
      if (to.name === 'meta:login') {
        return next()
      }
      return next({name: 'meta:login'})
    } 

    if (to.meta.title) {
      document.title = `DiSARM - ${to.meta.title}`
    } else {
      document.title = 'DiSARM'
    }

    if (to.name) {
      const theme = to.name.split(/:/)[0]
      router.app.$material.setCurrentTheme(theme)
    }

    next()

  })
  
  router.afterEach((to, from) => {
  })

  return router;
}



