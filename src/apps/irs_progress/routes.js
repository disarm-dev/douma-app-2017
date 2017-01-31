import IRSProgressApplet from './IRSProgressApplet.vue'
// import IRSProgressTasks from './tasks/tasks.vue'
// import IRSProgressMap from './map/map.vue'
// import IRSProgressList from './list/list.vue'
// import IRSProgressForm from './form/form.vue'
// import IRSProgressSync from './sync/sync.vue'
import ClustersList from './clusters/list.vue'
import ClustersEdit from './clusters/edit.vue'
import ClustersMap from './clusters/map.vue'
import ClustersSearch from './clusters/search.vue'
import Cluster from './cluster/list.vue'
import Task from './task/task.vue'

export default [
  {
    path: '/irs_progress',
    redirect: '/irs_progress/clusters',
    component: IRSProgressApplet,
    children: [
      {
        path: 'clusters',
        name: 'irs_progress:clusters:list',
        component: ClustersList
      },{
        path: 'clusters/edit',
        name: 'irs_progress:clusters:edit',
        component: ClustersEdit
      },{
        path: 'clusters/search',
        name: 'irs_progress:clusters:search',
        component: ClustersSearch
      },{
        path: 'clusters/map',
        name: 'irs_progress:clusters:map'
      },{
        path: 'clusters/:cluster_id',
        name: 'irs_progress:task:list'
      },{
        path: 'clusters/:cluster_id/map',
        name: 'irs_progress:task:map'
      },{
        path: 'clusters/:cluster_id/tasks/:task_id',
        name: 'irs_progress:task:view'
      },{
        path: 'clusters/:cluster_id/tasks/:task_id/edit',
        name: 'irs_progress:task:edit'
      }
    ]
  }
]

//   ,{
//     path: '/irs_progress/clusters/:cluster_id',
//     props: true,
//     name: 'irs_progress:cluster',
//     component: Cluster,
//     meta: {
//       title: 'Cluster'
//     }
//   },{
//     path: '/irs_progress/clusters/:cluster_id/task/:task_id',
//     props: true,
//     name: 'irs_progress:task',
//     component: Task,
//     meta: {
//       title: 'Task'
//     }
//   },{
//     path: '*',
//     redirect: '/irs_progress'
//   }
// ]


      // {
      //   path: 'tasks',
      //   name: 'irs_progress:tasks',
      //   component: IRSProgressTasks,
      //   meta: {
      //     title: 'Tasks'
      //   }
      // },
      // {
      //   path: 'map',
      //   name: 'irs_progress:map',
      //   component: IRSProgressMap,
      //   meta: {
      //     title: 'Map',
      //     keepRouteAlive: true
      //   }
      // },
      // {
      //   path: 'list',
      //   name: 'irs_progress:list',
      //   component: IRSProgressList,
      //   meta: {
      //     title: 'List'
      //   }
      // },
      // {
      //   path: 'form',
      //   name: 'irs_progress:form',
      //   component: IRSProgressForm,
      //   meta: {
      //     title: 'Form'
      //   }
      // },
      // {
      //   path: 'sync',
      //   name: 'irs_progress:sync',
      //   component: IRSProgressSync,
      //   meta: {
      //     title: 'Sync'
      //   }
      // },

