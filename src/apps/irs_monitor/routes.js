import view from './pages/not-a-dashboard.vue'

export default [
  {
    path: '/irs/monitor',
    component: view,
    name: 'irs_monitor',
    meta: {title: 'IRS Monitor', icon: 'dashboard'},
  }
]
