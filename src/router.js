import Vue from 'vue'
import VueRouter from 'vue-router'

// Meta
import App from './components/App.vue'
import Login from './pages/meta/user/login.vue'
import SyncStatus from './pages/meta/sync/status.vue'
import AOIMap from './pages/meta/aoi/map.vue'

// 
// FOCI
// 

// Monitor

import Monitor from './pages/foci/monitor/monitor.vue'

// Identify

import IdentifyMapGuessFoci from './pages/foci/identify/map_guess_foci.vue'

// Investigate

import InvestigateDetail from './pages/foci/investigate/detail.vue'
import InvestigateForm from './pages/foci/investigate/form.vue'
import InvestigateMap from './pages/foci/investigate/map.vue'

// Classify

import ClassifyForm from './pages/foci/classify/form.vue'

// Respond

import RespondForm from './pages/foci/respond/form.vue'

// 
// IRS
// 
import IRSTasks from './pages/irs/tasks/tasks.vue'
import IRSMap from './pages/irs/map/map.vue'
import IRSList from './pages/irs/list/list.vue'
import IRSForm from './pages/irs/form/form.vue'


// 
// CASES
// 
import CasesRoot from './pages/cases/root.vue'

// TODO: Namespace route names

// META
const meta = [
  {
    path: '/',
    name: 'meta',
    // component: App,
    redirect: '/foci'
  },
  {
    title: 'Login',
    path: '/login',
    name: 'meta:login',
    component: Login
  },
  { 
    title: 'Logout',
    path: '/logout',
    name: 'meta:logout',
    // component: Logout
    redirect: '/'
  },
  {
    title: 'Sync',
    path: '/sync',
    name: 'meta:sync',
    component: SyncStatus
  },
  {
    title: 'AOI',
    path: '/aoi',
    name: 'meta:aoi',
    component: AOIMap
  },
]

// FOCI
const foci_root = [
  {
    path: '/foci',
    name: 'foci',
    redirect: '/foci/monitor'
  }
]

const foci_monitor = [
  {
    title: 'Monitor',
    path: '/foci/monitor',
    name: 'foci:monitor',
    redirect: '/foci/monitor/list'
  },
  {
    title: 'Monitor',
    path: '/foci/monitor/list',
    name: 'foci:monitor:list',
    component: Monitor,
  },
  {
    title: 'Monitor',
    path: '/foci/monitor/map',
    name: 'foci:monitor:map',
    component: Monitor
  }
]

const foci_identify = [
  {
    title: 'Identify',
    path: '/foci/identify',
    name: 'foci:identify',
    redirect: '/foci/identify/map/guess_foci'
  },
  {
    title: 'Identify',
    path: '/foci/identify/map/guess_foci',
    name: 'foci:identify:map:guess_foci',
    component: IdentifyMapGuessFoci,
    meta: {
      keepRouteAlive: true
    }
  }
]

const foci_investigate = [
  {
    title: 'Investigate',
    path: '/foci/investigate',
    name: 'foci:investigate',
    redirect: '/foci/investigate/detail'
  },
  {
    title: 'Investigate',
    path: '/foci/investigate/detail',
    name: 'foci:investigate:detail',
    component: InvestigateDetail
  },
  {
    title: 'Investigate',
    path: '/foci/investigate/form',
    name: 'foci:investigate:form',
    component: InvestigateForm
  },
  {
    title: 'Investigate',
    path: '/foci/investigate/map',
    name: 'foci:investigate:map',
    component: InvestigateMap
  }
]

const foci_classify = [
  {
    title: 'Classify',
    path: '/foci/classify',
    name: 'foci:classify',
    redirect: '/foci/classify/form'
  },
  {
    title: 'Classify',
    path: '/foci/classify/form',
    name: 'foci:classify:form',
    component: ClassifyForm
  }
]

const foci_respond = [
  {
    title: 'Respond',
    path: '/foci/respond',
    name: 'foci:respond',
    redirect: '/foci/respond/form'
  },
  {
    title: 'Respond',
    path: '/foci/respond/form',
    name: 'foci:respond:form',
    component: RespondForm
  }
]


// IRS
const irs_root = [
  {
    path: '/irs',
    name: 'irs',
    redirect: '/irs/tasks'
  },
  {
    title: 'Tasks',
    path: '/irs/tasks',
    name: 'irs:tasks',
    component: IRSTasks
  },
  {
    title: 'Map',
    path: '/irs/map',
    name: 'irs:map',
    component: IRSMap,
    meta: {
      keepRouteAlive: true
    }
  },
  {
    title: 'List',
    path: '/irs/list',
    name: 'irs:list',
    component: IRSList
  },
  {
    title: 'Form',
    path: '/irs/form',
    name: 'irs:form',
    component: IRSForm
  },
]

// CASES
const cases_root = [
  {

    path: '/cases',
    name: 'cases',
    redirect: '/cases/monitor'
  }
]

const cases_monitor= [
  {
    title: 'Monitor Cases',
    path: '/cases/monitor',
    name: 'cases:monitor',
    component: CasesRoot
  },
  {
    path: '/cases/monitor/map',
    name: 'cases:monitor:map',
    component: CasesRoot
  }
]



const foci = [].concat(foci_root, foci_monitor, foci_identify, foci_investigate, foci_classify, foci_respond)

const irs = [].concat(irs_root)

const cases = [].concat(cases_root, cases_monitor)

const routes = [].concat(meta, foci, irs, cases)

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode: 'history'
})


export default router



