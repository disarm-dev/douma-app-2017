import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import store from './store'

import AppletContainer from './components/applet.vue'
import IRSProgressRoutes from './apps/irs_progress/routes'
// import FociRoutes from './apps/foci/routes'
// import GPSRoutes from './apps/gps/routes'
// import MetaRoutes from './apps/meta/routes'
// import CasesRoutes from './apps/cases/routes'

export default () => {
  // Configure routes for all Applets
  const routes = [
    {
      path: '/',
      redirect: '/profile',
      // component: AppletContainer,
      // children: [].concat(IRSProgressRoutes, FociRoutes, GPSRoutes, MetaRoutes, CasesRoutes)
    }
  ].concat(IRSProgressRoutes)
  
  // Instantiate `router`
  const router = new VueRouter({
    routes,
    mode: 'history'
  })

  // Add the guards
  router.beforeEach((to, from, next) => {
    if (to.name) {
      const theme = to.name.split(/:/)[0]
      router.app.$material.setCurrentTheme(theme) // TODO: @fix Need to avoid setting themes that don't exist
    }

    if (!store.state.user) {
      store.state.previousRoute = to
      if (to.name === 'meta:login') {
        return next()
      }
      return next({name: 'meta:login'})
    } 
    return next()
  })
  
  router.afterEach((to, from) => {
    console.log(to, from)
    // "/irs_progress/clusters/search"            ['irs_progress:']-> "Clusters Search" // Includes Results
    // "/irs_progress/clusters"                   ['irs_progress:']-> "Clusters List"
    // "/irs_progress/clusters/map"               ['irs_progress:']-> "Clusters Map"
    // "/irs_progress/clusters/222"               ['irs_progress:']-> "Clusters List/Map > Cluster 222 > Tasks List"
    // "/irs_progress/clusters/222/map"           ['irs_progress:']-> "Clusters List/Map > Cluster 222 > Tasks Map"
    // "/irs_progress/clusters/222/task/444"      ['irs_progress:']-> "Clusters List/Map > Cluster 222 > Tasks List/Map > Task 444"
    // "/irs_progress/clusters/222/task/444/form" ['irs_progress:']-> "Clusters List/Map > Cluster 222 > Tasks List/Map > Edit Task 444"
  })

  return router;
}



