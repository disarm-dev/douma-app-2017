import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

export default (instance_routes, store) => {

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
    // console.log(from, to)
    if (!store.state.meta || !store.state.meta.user) {
      if (to.name === 'meta:login') {
        return next()
      }
      store.state.meta.previousRoute = to.path
      return next({name: 'meta:login'})
    } 

    // if (to.meta.title) {
    //   document.title = `DiSARM - ${to.meta.title}`
    // } else {
    //   document.title = 'DiSARM'
    // }

    // if (to.name) {
    //   const theme = to.name.split(/:/)[0]
    //   router.app.$material.setCurrentTheme(theme)
    // }

    next()

  })
  
  router.afterEach((to, from) => {
  })

  return router;
}



