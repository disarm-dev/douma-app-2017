import TaskerApplet from './applet.vue'
import TaskerView from './pages/tasker/view.vue'
import TaskerMap from './pages/tasker/map.vue'

export default [
  {
    path: '/irs_tasker',
    name: 'irs_tasker',
    redirect: '/irs_tasker/view',
    component: TaskerApplet,
    meta: {title: 'IRS Tasker', icon: 'assignment_ind'},
    children: [
      {
        path: 'view',
        name: 'irs_tasker:view',
        redirect: '/irs_tasker/view/map',
        component: TaskerView,
        children: [
          {
            path: 'map',
            name: 'irs_tasker:map',
            component: TaskerMap,
          }
        ]
      }
    ]
  }
]
