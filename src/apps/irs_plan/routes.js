import IrsPlanApplet from './applet.vue'

import CreateView from './pages/create/view.vue'
// import Preview from './pages/create/preview.vue'

import ReviewView from './pages/review/view.vue'
import ReviewMap from './pages/review/map.vue'
import ReviewList from './pages/review/list.vue'

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
      },{
        path: 'review',
        name: 'irs_plan:review',
        redirect: '/irs_plan/review/map',
        component: ReviewView,
        meta: {},
        children: [
          {
            path: 'map',
            name: 'irs_plan:review:map',
            component: ReviewMap,
            meta: {title: 'IRS - Review clusters', type: 'map'}
          },{
            path: 'list',
            name: 'irs_plan:review:list',
            component: ReviewList,
            meta: {type: 'list'}
          }
        ]
      }
    ]
  }
]
