import IrsPlanApplet from './applet.vue'

// import DashboardView from './pages/dashboard/view.vue'

import store from '../../store'

export default [
  {
    path: '/irs_plan',
    name: 'irs_plan',
    redirect: '/irs_plan/view',
    component: IrsPlanApplet,
    meta: {title: 'IRS Plan', icon: 'gps_fixed'},
    children: [
      {
        path: '/irs_plan/view',
        name: "irs_plan:view",
        // component: DashboardView,
        meta: {}
      }
    ]
  }
]
