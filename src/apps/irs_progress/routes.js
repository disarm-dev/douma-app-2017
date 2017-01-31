import IRSProgressContainer from './IRSProgressContainer.vue'
import IRSProgressTasks from './tasks/tasks.vue'
import IRSProgressMap from './map/map.vue'
import IRSProgressList from './list/list.vue'
import IRSProgressForm from './form/form.vue'
import IRSProgressSync from './sync/sync.vue'
import IRSProgressClustersList from './cluster_list/cluster_list.vue'

export default [
  {
    path: '/irs_progress',
    name: 'irs_progress',
    meta: {
      title: 'IRSProgress'
    },
    component: IRSProgressContainer,
    redirect: '/irs_progress/clusters',
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
      },
      {
        path: 'clusters',
        name: 'irs_progress:clusters',
        component: IRSProgressClustersList,
        meta: {
          title: 'Clusters'
        }
      }
    ]
  }
]

