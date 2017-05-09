import IrsPlanApplet from './applet.vue'

import CreateView from './pages/create/view.vue'

import store from '../../store'

export default [
  {
    path: '/irs_plan',
    name: 'irs_plan',
    redirect: '/irs_plan/create',
    component: IrsPlanApplet,
    meta: {title: 'IRS Plan', icon: 'gps_fixed'},
    children: [
      {
        path: 'create',
        name: 'irs_plan:create',
        component: CreateView,
        meta: {title: 'Create'},
      }
    ]
  }
]
