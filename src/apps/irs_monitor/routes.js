import IrsMonitorApplet from './applet.vue'

import DashboardView from './pages/dashboard/view.vue'

import store from '../../store'

export default [
  {
    path: '/irs_monitor',
    name: 'irs_monitor',
    redirect: '/irs_monitor/view',
    component: IrsMonitorApplet,
    meta: {title: 'IRS Monitor', icon: 'dashboard'},
    children: [
      {
        path: '/irs_monitor/view',
        name: "irs_monitor:view",
        component: DashboardView,
        meta: {title: 'Dashboard'}
      }
    ]
  }
]
