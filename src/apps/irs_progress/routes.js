import IRSProgressApplet from './IRSProgressApplet.vue'

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
import TaskForm from './task/form.vue'

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
      },{
        path: 'clusters/list',
        name: 'irs_progress:clusters:list',
        component: ClustersList,
      },{
        path: 'clusters/map',
        name: 'irs_progress:clusters:map',
        component: ClustersMap,
      },{
        path: 'clusters/search',
        name: 'irs_progress:clusters:search',
        component: ClustersSearch,
      },{
        path: 'clusters/edit',
        name: 'irs_progress:clusters:edit',
        component: ClustersEdit,
      },


      {
        path: 'clusters/:cluster_id',
        name: 'irs_progress:cluster',
        redirect: '/irs_progress/clusters/:cluster_id/view',
      },{
        path: 'clusters/:cluster_id/view',
        name: 'irs_progress:cluster:view',
        component: ClusterView,
        props: true
      },{
        path: 'clusters/:cluster_id/map',
        name: 'irs_progress:cluster:map',
        component: ClusterMap,
        props: true
      },


      {
        path: 'clusters/:cluster_id/tasks',
        name: 'irs_progress:tasks',
        redirect: '/irs_progress/clusters/tasks/list',
      },{
        path: 'clusters/:cluster_id/tasks/list',
        name: 'irs_progress:tasks:list',
        component: TasksList,
      },{
        path: 'clusters/:cluster_id/tasks/map',
        name: 'irs_progress:tasks:map',
        component: TasksMap,
      },


      {
        path: 'clusters/:cluster_id/tasks/:task_id',
        name: 'irs_progress:task',
        redirect: '/irs_progress/clusters/:cluster_id/tasks/:task_id/view',
      },{
        path: 'clusters/:cluster_id/tasks/:task_id/view',
        name: 'irs_progress:task:view',
        component: TaskView,
      },{
        path: 'clusters/:cluster_id/tasks/:task_id/form',
        name: 'irs_progress:task:form',
        component: TaskForm,
      }

    ]
  }
]
