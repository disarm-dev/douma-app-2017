import RastersApplet from './applet.vue'
import RastersView from './pages/view.vue'

export default [
  {
    path: '/rasters',
    name: 'rasters',
    redirect: '/rasters/view',
    component: RastersApplet,
    meta: {title: 'Layers', icon: 'layers'},
    children: [
      {
        path: 'view',
        name: 'rasters:view',
        component: RastersView,
        meta: {title: 'View'}
      }
    ]
  }
]
