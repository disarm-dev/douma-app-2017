import applet from './applet.vue'
import home from './pages/home.vue'
import login from './pages/login.vue'
import logout from './pages/logout.vue'

import debug from './pages/debug.vue'
import location from './pages/location_debug.vue'
import building from './pages/building_debug.vue'
import validations from './pages/validations_debug.vue'
import fake_data from './pages/fake_data_debug.vue'

export default [
  {
    path: '/meta',
    component: applet,
    redirect: '/meta/home',
    name: 'meta',
    children: [
      {
        path: 'home',
        name: 'meta:home',
        component: home,
        meta: {title: 'Home'}
      },{
        path: 'login',
        name: 'meta:login',
        component: login,
      },{
        path: 'logout',
        name: 'meta:logout',
        component: logout,
      }
    ]
  }, {
    path: '/meta/debug',
    component: debug,
    name: 'meta:debug'
  }, {
    path: '/meta/debug/location',
    component: location,
    name: 'meta:debug:location'
  }, {
    path: '/meta/debug/building',
    component: building,
    name: 'meta:debug:building'
  }, {
    path: '/meta/debug/validations',
    component: validations,
    name: 'meta:debug:validations'
  }, {
    path: '/meta/debug/fake_data',
    component: fake_data,
    name: 'meta:debug:fake_data'
  }
]
