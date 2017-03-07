import IrsPlanApplet from './applet.vue'

import ReviewView from './pages/review/view.vue'
import ReviewMap from './pages/review/map.vue'
import ReviewList from './pages/review/list.vue'

import CreateView from './pages/create/view.vue'
import SelectOUs from './pages/create/select_ous.vue'
import Preview from './pages/create/preview.vue'

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
      },{
        path: '/irs_plan/create',
        name: 'irs_plan:create',
        redirect: '/irs_plan/create/select_ous',
        component: CreateView,
        meta: {},
        children: [
          {
            path: 'select_ous',
            name: 'irs_plan:create:select_ous',
            component: SelectOUs,
            meta: {title: 'IRS - Select areas'}
          },
          {
            path: 'preview',
            name: 'irs_plan:create:preview',
            component: Preview,
            meta: {}
          }
        ]
      }
    ]
  }
]
