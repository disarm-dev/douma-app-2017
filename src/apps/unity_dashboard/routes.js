import unity_dashboard from './applet.vue'

export default [
  {
    path: '/unity_dashboard/:dashboard_id',
    component: unity_dashboard,
    name: 'unity_dashboard',
    meta: {
      can: 'read unity_dashboard',
      fail: '/meta/home'
    }
  }
]
