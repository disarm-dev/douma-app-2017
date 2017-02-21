import IrsPlanApplet from './applet.vue'

import OperationalUnitView from './pages/operational_unit/view.vue'
import OperationalUnitMap from './pages/operational_unit/map.vue'
import OperationalUnitList from './pages/operational_unit/list.vue'

import ClustersView from './pages/clusters/view.vue'
import ClustersMap from './pages/clusters/map.vue'
import ClustersList from './pages/clusters/list.vue'

import store from '../../store'

export default [
  {
    path: '/irs_plan',
    name: 'irs_plan',
    redirect: '/irs_plan/clusters',
    component: IrsPlanApplet,
    meta: {title: 'IRS Plan', icon: 'gps_fixed'},
    children: [
      {
        path: '/irs_plan/clusters',
        name: 'irs_plan:clusters',
        redirect: '/irs_plan/clusters/map',
        component: ClustersView,
        meta: {},
        children: [
          {
            path: 'map',
            name: 'irs_plan:clusters:map',
            component: ClustersMap,
            meta: {type: 'map'}
          },{
            path: 'list',
            name: 'irs_plan:clusters:list',
            component: ClustersList,
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
