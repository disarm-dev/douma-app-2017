import TaskerApplet from './applet.vue'
import TaskerMap from './pages/tasker/map.vue'

export default [
  {
    path: '/irs_tasker',
    name: 'irs_tasker',
    redirect: '/irs_tasker/map',
    component: TaskerApplet,
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
