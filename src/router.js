import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)



export default (instance_routes, store, instance_config) => {

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
    console.log(to)
    const {title, icon} = to.meta
    store.commit('root:set_applet_header', {title, icon})      

    
    if (!store.state.meta || !store.state.meta.user) {
      if (to.name === 'meta:login') {
        return next()
      }
      store.state.meta.previousRoute = to.path
      return next({name: 'meta:login'})
    }

    next()

  })

  return router;
}

