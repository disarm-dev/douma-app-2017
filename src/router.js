import Vue from 'vue'
import VueRouter from 'vue-router'

// Meta
import App from './components/App.vue'
import Login from './pages/meta/user/login.vue'
import Logout from './pages/meta/user/logout.vue'
import SyncStatus from './pages/meta/sync/status.vue'
import AOIMap from './pages/meta/aoi/map.vue'

// Monitor

import MonitorList from './pages/foci/monitor/list.vue'
import MonitorMap from './pages/foci/monitor/map.vue'

// Identify

import IdentifyList from './pages/foci/identify/list.vue'
import IdentifyMapGuessFoci from './pages/foci/identify/map_guess_foci.vue'
import IdentifyMapEditFoci from './pages/foci/identify/map_edit_foci.vue'

// Investigate

import InvestigateDetail from './pages/foci/investigate/detail.vue'
import InvestigateMap from './pages/foci/investigate/map.vue'
import investigateMapEdit from './pages/foci/investigate/mapEdit.vue'

// Classify

import ClassifyDetail from './pages/foci/classify/detail.vue'
import ClassifyForm from './pages/foci/classify/form.vue'

// Respond

import RespondDetail from './pages/foci/respond/detail.vue'
import RespondForm from './pages/foci/respond/form.vue'

// TODO: Namespace route names

const meta = [
  {
    path: '/',
    name: 'home',
    component: App,
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout
  },
  {
    path: '/sync',
    name: 'sync',
    component: SyncStatus
  },
  {
    path: '/aoi',
    name: 'aoi',
    component: AOIMap
  },
  {
    path: '/foci',
    name: 'foci',
    redirect: '/foci/identify'
  }
]

const monitor = [
  {
    path: '/foci/monitor',
    name: 'monitor',
    redirect: '/foci/monitor/map'
  },
  {
    path: '/foci/monitor/list',
    name: 'monitor:list',
    component: MonitorList
  },
  {
    path: '/foci/monitor/map',
    name: 'monitor:map',
    component: MonitorMap
  }
]

const identify = [
  {
    path: '/foci/identify',
    name: 'identify',
    redirect: '/foci/identify/map/guess_foci'
  },
  {
    path: '/foci/identify/list',
    name: 'identify:list',
    component: IdentifyList
  },
  {
    path: '/foci/identify/map/guess_foci',
    name: 'identify:map:guess_foci',
    component: IdentifyMapGuessFoci
  },
  {
    path: '/foci/identify/map/edit_foci',
    name: 'identify:map:edit_foci',
    component: IdentifyMapEditFoci
  }
]

const investigate = [
  {
    path: '/foci/investigate',
    name: 'investigate',
    redirect: '/foci/investigate/detail'
  },
  {
    path: '/foci/investigate/detail',
    name: 'investigate:detail',
    component: InvestigateDetail
  },
  {
    path: '/foci/investigate/map',
    name: 'investigate:map',
    component: InvestigateMap
  },
  ,
  {
    path: '/foci/investigate/editmap',
    name: 'investigate:mapedit',
    component: investigateMapEdit
  }
]

const classify = [
  {
    path: '/foci/classify',
    name: 'classify',
    redirect: '/foci/classify/detail'
  },
  {
    path: '/foci/classify/detail',
    name: 'classify:detail',
    component: ClassifyDetail
  },
  {
    path: '/foci/classify/form',
    name: 'classify:form',
    component: ClassifyForm
  }
]

const respond = [
  {
    path: '/foci/respond',
    name: 'respond',
    redirect: '/foci/respond/detail'
  },
  {
    path: '/foci/respond/detail',
    name: 'respond:detail',
    component: RespondDetail
  },
  {
    path: '/foci/respond/form',
    name: 'respond:form',
    component: RespondForm
  }
]

const foci = [].concat(monitor, identify, investigate, classify, respond)

const routes = [].concat(meta, foci)

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode: 'history'
})


export default router



