import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'

// Meta
import App from './components/App.vue'
import FociContainer from './components/foci-container.vue'
import IRSContainer from './components/irs-container.vue'
import CasesContainer from './components/cases-container.vue'

import Root from './pages/meta/root.vue'
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

const beforeEnter = (to, from, next) => {
  if (!firebase.auth().currentUser) {
    return next('/login')
  } 
  next()
}

// META
const meta = [
  {
    path: '/',
    name: 'root',
    component: Root,
  },
  {
    path: '/login',
    name: 'meta:login',
    component: Login
  },
  { 
    path: '/logout',
    name: 'meta:logout',
    component: Logout
  },
  {
    path: '/sync',
    name: 'meta:sync',
    component: SyncStatus
  },
  {
    path: '/aoi',
    name: 'meta:aoi',
    component: AOIMap
  },
]

// FOCI
const foci = [
  {
    path: '/foci',
    name: 'foci',
    redirect: '/foci/monitor',
    component: FociContainer,
    beforeEnter,
    children: [
      {
        path: 'monitor',
        name: 'foci:monitor',
        redirect: 'monitor/list',
      },
      {
        path: 'monitor/list',
        name: 'foci:monitor:list',
        component: MonitorList,
      },
      {
        path: 'monitor/map',
        name: 'foci:monitor:map',
        component: MonitorMap,
        meta: {
          keepRouteAlive: true
        }
      },

      {
        path: 'identify',
        name: 'foci:identify',
        component: IdentifyMapGuessFoci,
        meta: {
          keepRouteAlive: true
        }
      },

      {
        path: 'investigate',
        name: 'foci:investigate',
        redirect: 'investigate/detail',
      },
      {
        path: 'investigate/detail',
        name: 'foci:investigate:detail',
        component: InvestigateDetail
      },
      {
        path: 'investigate/form',
        name: 'foci:investigate:form',
        component: InvestigateForm
      },
      {
        path: 'investigate/map',
        name: 'foci:investigate:map',
        component: InvestigateMap
      },

      {
        path: 'classify/form',
        name: 'foci:classify',
        component: ClassifyForm
      },

      {
        path: 'respond',
        name: 'foci:respond',
        component: RespondForm
      }
    ]
  }
]


// IRS
const irs = [
  {
    path: '/irs',
    name: 'irs',
    component: IRSContainer,
    redirect: '/irs/tasks',
    beforeEnter,
    children: [
      {
        path: 'tasks',
        name: 'irs:tasks',
        component: IRSTasks
      },
      {
        path: 'map',
        name: 'irs:map',
        component: IRSMap,
        meta: {
          keepRouteAlive: true
        }
      },
      {
        path: 'list',
        name: 'irs:list',
        component: IRSList
      },
      {
        path: 'form',
        name: 'irs:form',
        component: IRSForm
      }
    ]
  }
]

// CASES
const cases = [
  {
    path: '/cases',
    name: 'cases',
    redirect: '/cases/monitor',
    component: CasesContainer,
    beforeEnter,
    children: [
      {
        path: 'monitor',
        name: 'cases:monitor',
        component: CasesRoot
      },
      {
        path: 'monitor/map',
        name: 'cases:monitor:map',
        component: CasesRoot,
        meta: {
          keepRouteAlive: true
        }
      }
    ]
  }
]

const routes = [].concat(meta, foci, irs, cases)

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode: 'history'
})


export default router



