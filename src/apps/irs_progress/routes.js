import IRSProgressApplet from './IRSProgressApplet.vue'

import ClustersList from './clusters/list.vue'
import ClustersEdit from './clusters/edit.vue'
import ClustersMap from './clusters/map.vue'
import ClustersSearch from './clusters/search.vue'

import TasksList from './tasks/list.vue'
import TasksMap from './tasks/map.vue'

import TaskView from './task/view.vue'
import TaskEdit from './task/edit.vue'

// import Cluster from './cluster/list.vue'
// import Task from './task/task.vue'

export default [
  {
    path: '/irs_progress',
    name: 'irs_progress',
    redirect: '/irs_progress/clusters',
    component: IRSProgressApplet,
    children: [
      {
        path: 'clusters',
        name: 'irs_progress:clusters',
        redirect: 'clusters/list',
        children: [
          {
            path: 'list',
            name: 'irs_progress:clusters:list',
            component: ClustersList
          },{
            path: 'edit',
            name: 'irs_progress:clusters:edit',
            component: ClustersEdit
          },{
            path: 'search',
            name: 'irs_progress:clusters:search',
            component: ClustersSearch
          },{
            path: 'map',
            name: 'irs_progress:clusters:map',
            component: ClustersMap
          }
        ]
      },{
        path: 'tasks',
        name: 'irs_progress:tasks',
        redirect: 'tasks/list',
        children: [
          {
            path: ':cluster_id',
            redirect: ':cluster_id/list',
            props: true,
            children: [
              {
                path: 'list',
                name: 'irs_progress:tasks:list',
                component: TasksList,
                props: true
              },{
                path: 'map',
                name: 'irs_progress:tasks:map',
                component: TasksMap,
                props: true
              },{
                path: 'task/:task_id',
                name: 'irs_progress:task:view',
                component: TaskView,
                props: true
              },{
                path: 'task/:task_id/edit',
                name: 'irs_progress:task:edit',
                component: TaskEdit,
                props: true
              }
            ]
          }
        ]
      }
    ]
  }
]
