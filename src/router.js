import Vue from 'vue'
import VueRouter from 'vue-router'

// Meta
import App from './components/App.vue'
import Login from './pages/meta/user/login.vue'
import Logout from './pages/meta/user/logout.vue'
import SyncStatus from './pages/meta/sync/status.vue'
import AOIMap from './pages/meta/aoi/map.vue'

// 
// FOCI
// 

// Monitor

import MonitorList from './pages/foci/monitor/list.vue'
import MonitorMap from './pages/foci/monitor/map.vue'

// Identify

import IdentifyList from './pages/foci/identify/list.vue'
import IdentifyMapGuessFoci from './pages/foci/identify/map_guess_foci.vue'
import IdentifyMapEditFoci from './pages/foci/identify/map_edit_foci.vue'

// Investigate

import InvestigateDetail from './pages/foci/investigate/detail.vue'
import InvestigateForm from './pages/foci/investigate/form.vue'
import InvestigateMap from './pages/foci/investigate/map.vue'
import investigateMapEdit from './pages/foci/investigate/mapEdit.vue'

// Classify

import ClassifyForm from './pages/foci/classify/form.vue'

// Respond

import RespondForm from './pages/foci/respond/form.vue'

// 
// IRS
// 
import IRSRoot from './pages/irs/root.vue'


// 
// CASES
// 
import CasesRoot from './pages/cases/root.vue'

// TODO: Namespace route names

// META
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
    redirect: '/foci/monitor'
  }
]

// FOCI
const foci_monitor = [
  {
    thematic_area: 'foci',
    path: '/foci',
    name: 'foci:root',
    component: 'FociRoot'
  },
  {
    thematic_area: 'foci',
    is_root: true,
    path: '/foci/monitor',
    name: 'foci:monitor',
    redirect: '/foci/monitor/list'
  },
  {
    thematic_area: 'foci',
    path: '/foci/monitor/list',
    name: 'foci:monitor:list',
    component: MonitorList
  },
  {
    thematic_area: 'foci',
    path: '/foci/monitor/map',
    name: 'foci:monitor:map',
    component: MonitorMap
  }
]

const foci_identify = [
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

const foci_investigate = [
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
    path: '/foci/investigate/form',
    name: 'investigate:form',
    component: InvestigateForm
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

const foci_classify = [
  {
    path: '/foci/classify',
    name: 'classify',
    redirect: '/foci/classify/form'
  },
  {
    path: '/foci/classify/form',
    name: 'classify:form',
    component: ClassifyForm
  }
]

const foci_respond = [
  {
    path: '/foci/respond',
    name: 'respond',
    redirect: '/foci/respond/form'
  },
  {
    path: '/foci/respond/form',
    name: 'respond:form',
    component: RespondForm
  }
]


// IRS
const irs_root = [
  {
    path: '/irs',
    name: 'irs',
    component: IRSRoot
  }
]

// CASES
const cases_root = [
  {
    path: '/cases',
    name: 'cases',
    component: CasesRoot
  }
]


const foci = [].concat(foci_monitor, foci_identify, foci_investigate, foci_classify, foci_respond)

const irs = [].concat(irs_root)

const cases = [].concat(cases_root)

const routes = [].concat(meta, foci, irs, cases)

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode: 'history'
})


export default router



