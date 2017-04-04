import FociApplet from './applet.vue'
import FociView from './pages/foci_register/view.vue'

export default [
  {
    path: '/foci',
    name: 'foci',
    redirect: '/foci/view',
    component: FociApplet,
    meta: {title: 'Foci', icon: 'location_searching'},
    children: [
      {
        path: 'view',
        name: 'foci:view',
        component: FociView,
        meta: {title: 'View'}
      },
       {
        path: 'view',
        name: 'foci:view',
        component: FociView,
        meta: {title: 'View'}
      }
    ]
  }
]
