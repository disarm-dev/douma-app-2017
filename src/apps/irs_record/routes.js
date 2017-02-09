import IrsRecordApplet from './IrsRecordApplet.vue'
import ContainerComponent from '../../components/container-component.vue'

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

export default [
  {
    path: '/irs_record',
    name: 'irs_record',
    redirect: '/irs_record/clusters'
  },{
    path: '/irs_record/clusters',
    name: 'irs_record:clusters',
    redirect: '/irs_record/clusters/list',    
    component: IrsRecordApplet,
    meta: { breadcrumb: 'Clusters' },
    children: [
      {
        path: 'list',
        name: 'irs_record:clusters:list',
        component: ClustersList,
      },{
        path: 'map',
        name: 'irs_record:clusters:map',
        component: ClustersMap,
        meta: { breadcrumb: 'Map' }
      },{
        path: 'search',
        name: 'irs_record:clusters:search',
        component: ClustersSearch,
        meta: { breadcrumb: 'Search' }
      },{
        path: 'edit',
        name: 'irs_record:clusters:edit',
        component: ClustersEdit,
        meta: { breadcrumb: 'Edit' }
      },{
        path: ':cluster_id',
        name: 'irs_record:clusters:view',
        component: ContainerComponent,
        meta: { prependBreadcrumb: 'cluster_id', breadcrumb: '' },
        redirect: '/irs_record/clusters/:cluster_id/view',
        children: [
          {
            path: 'view',
            name: 'irs_record:cluster:view',
            component: ClusterView,
            meta: { prependBreadcrumb: '', breadcrumb: 'Tasks', appendBreadcrumb: '' },
            props: true,
          },{
            path: 'map',
            name: 'irs_record:cluster:map',
            component: ClusterMap,
            meta: { prependBreadcrumb: '', breadcrumb: 'Map'},
            props: true
          },{
            path: 'tasks',
            name: 'irs_record:tasks',
            redirect: '/irs_record/clusters/:cluster_id/tasks/list',
            component: ContainerComponent,
            meta: { prependBreadcrumb: '', breadcrumb: 'Tasks', appendBreadcrumb: '' },
            children: [
              {
                path: 'list', // /irs_record/clusters/:cluster_id/tasks/list
                name: 'irs_record:tasks:list',
                component: TasksList,
                meta: { breadcrumb: 'List'}
              },{
                path: 'map',
                name: 'irs_record:tasks:map',
                component: TasksMap,
                meta: { breadcrumb: 'Map'}
              },{
                path: ':task_id',
                name: 'irs_record:task',
                redirect: '/irs_record/clusters/:cluster_id/tasks/:task_id/view',
                component: ContainerComponent,
                meta: { prependBreadcrumb: '', breadcrumb: '', appendBreadcrumb: 'task_id'},
                children: [
                  {
                    path: 'view',
                    name: 'irs_record:task:view',
                    component: TaskView,
                    meta: { breadcrumb: 'View'}
                  },{
                    path: 'edit',
                    name: 'irs_record:task:edit',
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
