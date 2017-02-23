import IrsPlanApplet from './applet.vue'

import OperationalUnitView from './pages/operational_unit/view.vue'
import OperationalUnitMap from './pages/operational_unit/map.vue'
import OperationalUnitList from './pages/operational_unit/list.vue'

import ReviewView from './pages/review/view.vue'
import ReviewMap from './pages/review/map.vue'
import ReviewList from './pages/review/list.vue'

import store from '../../store'

export default [
  {
    path: '/irs_plan',
    name: 'irs_plan',
    redirect: '/irs_plan/review',
    component: IrsPlanApplet,
    meta: {title: 'IRS Plan', icon: 'gps_fixed'},
    children: [
      {
        path: '/irs_plan/review',
        name: 'irs_plan:review',
        component: ReviewMap,
        meta: {},
        children: [
          {
            path: 'map',
            name: 'irs_plan:review:map',
            component: ReviewMap,
            meta: {type: 'map'}
          },{
            path: 'list',
            name: 'irs_plan:review:list',
            component: ReviewList,
            meta: {type: 'list'}
          }
        ]
      },{
        path: '/irs_plan/operational_unit',
        name: "irs_plan:operational_unit",
        redirect: '/irs_plan/operational_unit/map',
        component: OperationalUnitView,
        meta: {},
        children: [
          {
            path: 'map',
            name: 'irs_plan:operational_unit:map',
            component: OperationalUnitMap,
            meta: {type: 'map'}
          },{
            path: 'list',
            name: 'irs_plan:operational_unit:list',
            component: OperationalUnitMap,
            meta: {type: 'list'}
          }
        ]
      }
    ]
  }
]
