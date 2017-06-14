import applet from './applet.vue'
import home from './pages/home.vue'
import login from './pages/login.vue'
import logout from './pages/logout.vue'
import help from './pages/help.vue'

import location from './pages/location_debug.vue'
import building from './pages/building_debug.vue'

export default [
  {
    path: '/meta',
    component: applet,
    redirect: '/meta/home',
    name: 'meta',
    meta: {title: 'User', icon: 'person'},
    children: [
      {
        path: 'home',
        name: 'meta:home',
        component: home,
        meta: {title: 'Home'}
      },{
        path: 'help',
        name: 'meta:help',
        component: help,
        meta: {title: 'Help'}
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
  },{
    path: '/meta/location',
    component: location,
    name: 'meta:location'
  },{
    path: '/meta/building',
    component: building,
    name: 'meta:building'
  }
]
