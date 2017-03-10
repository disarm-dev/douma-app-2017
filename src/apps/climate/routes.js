import ClimateApplet from './applet.vue'
import ClimateView from './pages/view.vue'

export default [
  {
    path: '/climate',
    name: 'climate',
    redirect: '/climate/view',
    component: ClimateApplet,
    meta: {title: 'Climate', icon: 'cloud'},
    children: [
      {
        path: 'view',
        name: 'climate:view',
        component: ClimateView,
        meta: {title: 'View'}
      }
    ]
  }
]
