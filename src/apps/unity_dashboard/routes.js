import unity_dashboard from './applet.vue'

export default [
  {
    path: '/unity_dashboard',
    component: dashboard_list,
    name: 'unity_dashboard:list',
    meta: {
      can: 'read unity_dashboard',
      fail: '/meta/home'
    },
  },
  {
    path: '/unity_dashboard/:dashboard_id',
    component: unity_dashboard,
    name: 'unity_dashboard:show',
    props: true,
    meta: {
      can: 'read unity_dashboard',
      fail: '/meta/home'
    },
  }
]
