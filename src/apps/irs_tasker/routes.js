import TaskerView from './pages/tasker/view.vue'
import TaskerMap from './pages/tasker/map.vue'

import store from '../../store'

export default [
  {
    path: '/irs_tasker',
    name: 'irs_tasker',
    redirect: '/irs_tasker/map',
    component: TaskerView,
    meta: {title: 'IRS Tasker', icon: 'assignment_ind'},
    children: [
      {
        path: '/irs_tasker/map',
        name: 'irs_tasker:map',
        component: TaskerMap,
      }
    ]
  }
]
