import IRSProgressApplet from './IRSProgressApplet.vue'
import EmptyComponent from '../../components/empty_component.vue'

import ClustersList from './clusters/list.vue'
import ClustersEdit from './clusters/edit.vue'
import ClustersMap from './clusters/map.vue'
import ClustersSearch from './clusters/search.vue'

import ClusterView from './cluster/view.vue'
import ClusterMap from './cluster/map.vue'

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
    redirect: '/irs_progress/clusters'
  },{
    path: '/irs_progress/clusters',
    name: 'irs_progress:clusters',
    redirect: '/irs_progress/clusters/list',    
    component: IRSProgressApplet,
    meta: { breadcrumb: 'Clusters' },
    children: [
      {
        path: 'list',
        name: 'irs_progress:clusters:list',
        component: ClustersList,
      },{
        path: 'map',
        name: 'irs_progress:clusters:map',
        component: ClustersMap,
        meta: { breadcrumb: 'Map' }
      },{
        path: 'search',
        name: 'irs_progress:clusters:search',
        component: ClustersSearch,
        meta: { breadcrumb: 'Search' }
      },{
        path: 'edit',
        name: 'irs_progress:clusters:edit',
        component: ClustersEdit,
        meta: { breadcrumb: 'Edit' }
      },{
        path: ':cluster_id',
        name: 'irs_progress:clusters:view',
        component: EmptyComponent,
        redirect: '/irs_progress/clusters/:cluster_id/view',
        meta: { prependBreadcrumb: 'cluster_id', breadcrumb: '' },
        children: [
          {
            path: 'view',
            name: 'irs_progress:cluster:view',
            component: ClusterView,
            props: true
          },{
            path: 'map',
            name: 'irs_progress:cluster:map',
            component: ClusterMap,
            meta: { breadcrumb: 'Map'},
            props: true
          },{
            path: 'tasks',
            name: 'irs_progress:tasks',
            redirect: '/irs_progress/clusters/:cluster_id/tasks/list',
            component: EmptyComponent,
            meta: { breadcrumb: 'Tasks' },
            children: [
              {
                path: 'list', // /irs_progress/clusters/:cluster_id/tasks/list
                name: 'irs_progress:tasks:list',
                component: TasksList,
              },{
                path: 'map',
                name: 'irs_progress:tasks:map',
                component: TasksMap,
                meta: { breadcrumb: 'Map'}
              },{
                path: ':task_id',
                name: 'irs_progress:task',
                redirect: '/irs_progress/clusters/:cluster_id/tasks/:task_id/view',
                component: EmptyComponent,
                meta: { prependBreadcrumb: 'task_id', breadcrumb: ''},
                children: [
                  {
                    path: 'view',
                    name: 'irs_progress:task:view',
                    component: TaskView,
                  },{
                    path: 'edit',
                    name: 'irs_progress:task:edit',
                    component: TaskEdit,
                    meta: { breadcrumb: 'Edit'}
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]
