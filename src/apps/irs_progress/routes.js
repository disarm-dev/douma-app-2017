import IRSProgressContainer from './IRSProgress.vue'
import IRSProgressTasks from './tasks/tasks.vue'
import IRSProgressMap from './map/map.vue'
import IRSProgressList from './list/list.vue'
import IRSProgressForm from './form/form.vue'
import IRSProgressSync from './sync/sync.vue'

export default [
  {
    path: '/irs_progress',
    name: 'irs_progress',
    meta: {
      title: 'IRSProgress Progress'
    },
    component: IRSProgressContainer,
    redirect: '/irs_progress/tasks',
    children: [
      {
        path: 'tasks',
        name: 'irs_progress:tasks',
        component: IRSProgressTasks,
        meta: {
          title: 'Tasks'
        }
      },
      {
        path: 'map',
        name: 'irs_progress:map',
        component: IRSProgressMap,
        meta: {
          title: 'Map',
          keepRouteAlive: true
        }
      },
      {
        path: 'list',
        name: 'irs_progress:list',
        component: IRSProgressList,
        meta: {
          title: 'List'
        }
      },
      {
        path: 'form',
        name: 'irs_progress:form',
        component: IRSProgressForm,
        meta: {
          title: 'Form'
        }
      },
      {
        path: 'sync',
        name: 'irs_progress:sync',
        component: IRSProgressSync,
        meta: {
          title: 'Sync'
        }
      }
    ]
  }
]

