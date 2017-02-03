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
    // ROOT URL: irs_progress/
    // "clusters"                    ---> 'list'
    // "clusters/list"               ['irs_progress:clusters:list']   -> "Cluster List" // Current locally-stored Clusters
    // "clusters/edit"               ['irs_progress:clusters:edit']   -> "Cluster Edit" // Which Clusters to get local data for
    // "clusters/search"             ['irs_progress:clusters:search'] -> "Cluster Search" // Includes Results (remote + local)
    // "clusters/map"                ['irs_progress:clusters:map']    -> "Cluster Map"
    // "clusters/222"                ---> 'view'
    // "clusters/222/view"           ['irs_progress:cluster:view']
    // "clusters/222/map"            ['irs_progress:cluster:map']       -> "Cluster List/Map > Cluster 222 > Tasks Map"
    // "clusters/222/tasks"          ['irs_progress:tasks:list']      -> "Cluster List/Map > Cluster 222 > Tasks List"
    // "clusters/222/tasks/map"      ['irs_progress:tasks:map']      -> "Cluster List/Map > Cluster 222 > Tasks List"
    // "clusters/222/tasks/444"      ['irs_progress:task:view']      -> "Cluster List/Map > Cluster 222 > Tasks List/Map > Task 444"
    // "clusters/222/task/444/form"  ['irs_progress:task:edit']      -> "Cluster List/Map > Cluster 222 > Tasks List/Map > Edit Task 444"
    // "clusters/222/task/444/map"   ['irs_progress:task:map']      -> "Cluster List/Map > Cluster 222 > Tasks List/Map > Edit Task 444"
  })

  return router;
}



