import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import store from './store'

import AppletContainer from './components/applet.vue'
import IRSProgressRoutes from './apps/irs_record/routes'
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
    // breadcrumbsFor(to)
    // ROOT URL: irs_record/ {IRSProgressApplet}
    // "clusters"                    ---> 'list'                                                                                          ClusterParentView
    // "clusters/list"               ['irs_record:clusters:list']   -> "Clusters List" // Current locally-stored Clusters               ClustersList / <clusters-list>
    // "clusters/map"                ['irs_record:clusters:map']    -> "Clusters Map"
    // "clusters/search"             ['irs_record:clusters:search'] -> "Clusters Search" // Includes Results (remote + local)
    // "clusters/edit"               ['irs_record:clusters:edit']   -> "Clusters Edit" // Which Clusters to get local data for
    // "clusters/222"                ---> 'view'
    // "clusters/222/view"           ['irs_record:cluster:view']    -> "Clusters > 222 "
    // "clusters/222/map"            ['irs_record:cluster:map']     -> "Clusters > 222 Map"
    // "clusters/222/tasks"          ---> 'list'
    // "clusters/222/tasks/list"     ['irs_record:tasks:list']      -> "Clusters > 222 > Tasks List"
    // "clusters/222/tasks/map"      ['irs_record:tasks:map']       -> "Clusters > 222 > Tasks Map"
    // "clusters/222/tasks/444"      ---> 'view'
    // "clusters/222/tasks/444/view" ['irs_record:task:view']       -> "Cluster > Cluster 222 > Tasks > 444"
    // "clusters/222/tasks/444/form" ['irs_record:task:edit']       -> "Cluster > Cluster 222 > Tasks > 444 Edit"
  })

  return router;
}



