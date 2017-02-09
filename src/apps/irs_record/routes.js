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


export default [
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
        name: 'irs_record:clusters_search:map',
        component: ClustersSearchMap,
        meta: {type: 'map'}
      },{
        path: 'list',
        name: 'irs_record:clusters_search:list',
        component: ClustersSearchList,
        meta: {type: 'list'}
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
        name: 'irs_record:clusters:map',
        component: ClustersMap,
        meta: {type: 'map'}
      },{
        path: 'list',
        name: 'irs_record:clusters:list',
        component: ClustersList,
        meta: {type: 'list'}
      }
    ]
  },{
    path: '/irs_record/clusters/:cluster_id',
    name: 'irs_record:cluster_view',
    redirect: '/irs_record/clusters/:cluster_id/tasks',
  },{
    path: '/irs_record/clusters/:cluster_id/tasks',
    name: 'irs_record:tasks_view',
    component: TasksView,
    props: true,
    redirect: '/irs_record/clusters/:cluster_id/tasks/map',
    children: [
      {
        path: 'map',
        name: 'irs_record:tasks_view:map',
        component: TasksMap,
        meta: {type: 'map'},
        props: true
      },{
        path: 'list',
        name: 'irs_record:tasks_view:list',
        component: TasksList,
        meta: {type: 'list'},
        props: true
      }
    ]
  },{
    path: '/irs_record/clusters/:cluster_id/tasks/:task_id',
    name: 'irs_record:task_view',
    component: TaskView,
    props: true,
    redirect: '/irs_record/clusters/:cluster_id/tasks/:task_id/show',
    children: [
      {
        path: 'show',
        name: 'irs_record:task_view:show',
        component: TaskShow,
        props: true
      },{
        path: 'edit',
        name: 'irs_record:task_view:edit',
        component: TaskEdit,
        props: true
      }
    ]
  }
]
