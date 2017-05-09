import applet from './applet.vue'
import home from './pages/home.vue'
import login from './pages/login.vue'

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
      },
      {
        path: 'login',
        name: 'meta:login',
        component: login,
      }
    ]
  }
]
