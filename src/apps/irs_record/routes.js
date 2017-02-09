import IrsRecordApplet from './IrsRecordApplet.vue'

import ClustersSearchView from './pages/clusters_search/view.vue'
import ClustersSearchMap from './pages/clusters_search/map.vue'
import ClustersSearchList from './pages/clusters_search/list.vue'

import ClustersView from './pages/clusters/view.vue'
import ClustersMap from './pages/clusters/map.vue'
import ClustersList from './pages/clusters/list.vue'

import ClusterView from './pages/cluster/view.vue'
import ClusterShow from './pages/cluster/show.vue'

import TasksView from './pages/tasks/view.vue'
import TasksMap from './pages/tasks/map.vue'
import TasksList from './pages/tasks/list.vue'

import TaskView from './pages/task/view.vue'
import TaskShow from './pages/task/show.vue'
import TaskEdit from './pages/task/edit.vue'

const definitions = [
  {
    path: '/irs_record',
    name: 'irs_record',
    redirect: '/irs_record/clusters',
    component: IrsRecordApplet
  },{
    path: '/irs_record/clusters/search',
    name: 'irs_record:clusters_search',
    redirect: '/irs_record/clusters/search/map',
    component: ClustersSearchView,
    children: [
      {
        path: 'map',
        component: ClustersSearchMap
      },{
        path: 'list',
        component: ClustersSearchList
      }
    ]
  },{
    path: '/irs_record/clusters',
    name: 'irs_record:clusters_view',
    component: ClustersView,
    redirect: '/irs_record/clusters/map',
    children: [
      {
        path: 'map',
        component: ClustersMap
      },{
        path: 'list',
        component: ClustersList
      }
    ]
  },{
    path: '/irs_record/clusters/:cluster_id',
    name: 'irs_record:cluster_view',
    component: ClusterView,
    redirect: '/irs_record/clusters/:cluster_id/show',
    children: [
      {
        path: 'show',
        name: 'irs_record:cluster:show',
        component: ClusterShow
      }
    ]
  },{
    path: '/irs_record/clusters/:cluster_id/tasks',
    name: 'irs_record:clusters:tasks_view',
    component: TasksView,
    redirect: '/irs_record/clusters/:cluster_id/tasks/map',
    children: [
      {
        path: 'map',
        component: TasksMap
      },{
        path: 'list',
        component: TasksList
      }
    ]
  },{
    path: '/irs_record/clusters/:cluster_id/tasks/:task_id',
    name: 'irs_record:clusters:task_view',
    component: TaskView,
    redirect: '/irs_record/clusters/:cluster_id/tasks/:task_id/show',
    children: [
      {
        path: 'show',
        component: TaskShow
      },{
        path: 'edit',
        component: TaskEdit
      }
    ]
  }
]

export default definitions
