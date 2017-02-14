import IrsMonitorApplet from './irs_monitor_applet.vue'

import Show from './pages/show.vue'

export default [
  {
    path: '/irs_monitor',
    redirect: '/irs_monitor/show',
    name: 'irs_monitor',
    component: IrsMonitorApplet,
    meta: { title: 'IRS Monitor', icon: 'view_compact'},
    children: [
      {
        path: 'show',
        name: 'irs_monitor:show',
        component: Show,
        meta: {}
      }
    ]
  }
]
