import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import store from './store'

import IRSMonitorRoutes from './apps/irs_monitor/routes'
import IRSPlanningRoutes from './apps/irs_plan/routes'
import IRSRecordRoutes from './apps/irs_record/routes'
import IRSTaskerRoutes from './apps/irs_tasker/routes'
// import FociRoutes from './apps/foci/routes'
// import GPSRoutes from './apps/gps/routes'
import ClimateRoutes from './apps/climate/routes'

import MetaRoutes from './apps/meta/routes'
// import CasesRoutes from './apps/cases/routes'

export default () => {
  // Configure routes for all Applets
  const routes = [
    {
      path: '/',
      redirect: '/irs_plan/new',
    }
  ].concat(IRSMonitorRoutes, IRSPlanningRoutes, IRSTaskerRoutes, IRSRecordRoutes, ClimateRoutes, MetaRoutes, {
    path: '*',
    redirect: 'meta/profile'
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
      router.app.$material.setCurrentTheme(theme) // TODO: @fix Need to avoid setting themes that don't exist
    }

    next()

  })
  
  router.afterEach((to, from) => {
  })

  return router;
}



