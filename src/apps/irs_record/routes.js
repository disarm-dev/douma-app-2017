import IrsRecordApplet from './irs_record_applet.vue'

import ClustersSearchView from './pages/clusters_search/view.vue'
import ClustersSearchMap from './pages/clusters_search/map.vue'
import ClustersSearchList from './pages/clusters_search/list.vue'

import ClustersView from './pages/clusters/view.vue'
import ClustersMap from './pages/clusters/map.vue'
import ClustersList from './pages/clusters/list.vue'
import ClustersEdit from './pages/clusters/edit.vue'

import ClusterView from './pages/cluster/view.vue'
import ClusterShow from './pages/cluster/show.vue'

import TasksView from './pages/tasks/view.vue'
import TasksMap from './pages/tasks/map.vue'
import TasksList from './pages/tasks/list.vue'

import TaskView from './pages/task/view.vue'
import TaskShow from './pages/task/show.vue'
import TaskEdit from './pages/task/edit.vue'

import store from '../../store'

export default [
  {
    path: '/irs_record',
    name: 'irs_record',
    redirect: '/irs_record/clusters',
    component: IrsRecordApplet,
    beforeEnter: (to, from, next) => {
      // Bootstrap initial data for thisApplet
      store.dispatch('irs_record:set_clusters_from_local').then(() => {
        next()
      })
    },
    children: [
      {
        path: '/irs_record/clusters/search',
        name: 'irs_record:clusters_search',
        redirect: '/irs_record/clusters/search/map',
        component: ClustersSearchView,
        meta: {},
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
        name: 'irs_record:clusters',
        redirect: '/irs_record/clusters/map',
        component: ClustersView,
        meta: {},
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
          },{
            path: 'edit',
            name: 'irs_record:clusters:edit',
            component: ClustersEdit,
            meta: {}
          }
        ]
      },{
        path: '/irs_record/clusters/:cluster_id',
        name: 'irs_record:cluster',
        redirect: '/irs_record/clusters/:cluster_id/show',
        component: ClusterView,
        meta: {},
        props: true,
        children: [
          {
            path: 'show',
            name: 'irs_record:cluster:show',
            component: ClusterShow,
            props: true
          }
        ]
      },{
        path: '/irs_record/clusters/:cluster_id/tasks',
        name: 'irs_record:tasks',
        redirect: '/irs_record/clusters/:cluster_id/tasks/map',
        component: TasksView,
        meta: {},
        props: true,
        children: [
          {
            path: 'map',
            name: 'irs_record:tasks:map',
            component: TasksMap,
            meta: {type: 'map'},
            props: true
          },{
            path: 'list',
            name: 'irs_record:tasks:list',
            component: TasksList,
            meta: {type: 'list'},
            props: true
          }
        ]
      },{
        path: '/irs_record/clusters/:cluster_id/tasks/:task_id',
        name: 'irs_record:task',
        component: TaskView,
        meta: {},
        props: true,
        redirect: '/irs_record/clusters/:cluster_id/tasks/:task_id/edit',
        children: [
          {
            path: 'show',
            name: 'irs_record:task:show',
            component: TaskShow,
            meta: {type: 'show'},
            props: true
          },{
            path: 'edit',
            name: 'irs_record:task:edit',
            component: TaskEdit,
            meta: {type: 'edit'},
            props: true
          }
        ]
      }
    ]
  }
]
