import Vue from 'vue'
import VueRouter from 'vue-router'

import AppletContainer from './components/applet.vue'

import IRSProgressRoutes from './apps/irs_progress/routes'
// import FociRoutes from './apps/foci/routes'
// import GPSRoutes from './apps/gps/routes'
// import MetaRoutes from './apps/meta/routes'
// import CasesRoutes from './apps/cases/routes'


export default function getRouter(store) {

  const routes = [
    {
      path: '/',
      redirect: '/profile',
      meta: {
        title: 'DOUMA'
      },
      component: AppletContainer,
      // children: [].concat(IRSProgressRoutes, FociRoutes, GPSRoutes, MetaRoutes, CasesRoutes)
      children: [].concat(IRSProgressRoutes)
    }
  ]

  Vue.use(VueRouter)

  const router = new VueRouter({
    routes,
    mode: 'history'
  })

  router.beforeEach((to, from, next) => {
    const theme = to.name.split(/:/)[0]
    router.app.$material.setCurrentTheme(theme) // TODO: @fix Need to avoid setting themes that don't exist

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
    let string = null
    if (router.app && router.app.$route) {
      
      router.app.$route.matched.map((r, i) => {
        string = (string ? string +  ' > ' + r.meta.title : r.meta.title)

        
      })
      console.log(string)
      store.state.breadCrumbs = string
    }    
  })

  return router;
}



