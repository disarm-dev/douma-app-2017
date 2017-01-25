import Vue from 'vue'
import VueRouter from 'vue-router'
import Parse from 'parse'

// Meta
import App from './components/App.vue'
import FociContainer from './components/foci-container.vue'
import IRSContainer from './components/irs-container.vue'
import CasesContainer from './components/cases-container.vue'

import Root from './apps/meta/root.vue'
import Profile from './apps/meta/user/profile.vue'
import Login from './apps/meta/user/login.vue'
import Logout from './apps/meta/user/logout.vue'
import ResetPassword from './apps/meta/user/resetPassword.vue'
import NewUser from './apps/meta/user/newUser.vue'
import SyncStatus from './apps/meta/sync/status.vue'
import AOIMap from './apps/meta/aoi/map.vue'

// GPS

import GPSExample from './apps/gps/root.vue'

// 
// FOCI
// 

// Monitor

import MonitorList from './apps/foci/monitor/list.vue'
import MonitorMap from './apps/foci/monitor/map.vue'

// Identify

import IdentifyMapGuessFoci from './apps/foci/identify/map_guess_foci.vue'

// Investigate

import InvestigateDetail from './apps/foci/investigate/detail.vue'
import InvestigateForm from './apps/foci/investigate/form.vue'
import InvestigateMap from './apps/foci/investigate/map.vue'

// Classify

import ClassifyForm from './apps/foci/classify/form.vue'

// Respond

import RespondForm from './apps/foci/respond/form.vue'

// 
// IRS
// 
import IRSTasks from './apps/irs/tasks/tasks.vue'
import IRSMap from './apps/irs/map/map.vue'
import IRSList from './apps/irs/list/list.vue'
import IRSForm from './apps/irs/form/form.vue'
import IRSSync from './apps/irs/sync/sync.vue'


// 
// CASES
// 
import CasesRoot from './apps/cases/root.vue'

export default function getRouter(store) {


  const beforeEnter = (to, from, next) => {
    // if (!Parse.User.current()) {
    //   // save route, so we can send user back after login
    //   store.state.previousRoute = to
    //   return next('/login')
    // } 
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
      path: '/profile',
      name: 'meta:profile',
      component: Profile,
      beforeEnter
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
      path: '/resetpassword',
      name: 'meta:resetpassword',
      component: ResetPassword
    },
    { 
      path: '/newuser',
      name: 'meta:newuser',
      component: NewUser
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
        },
        {
          path: 'sync',
          name: 'irs:sync',
          component: IRSSync
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

  const gps = [
    {
      path: '/gps',
      name: 'gps',
      component: GPSExample,

    }
  ]

  const routes = [].concat(meta, foci, irs, cases, gps)

  Vue.use(VueRouter)

  const router = new VueRouter({
    routes,
    mode: 'history'
  })

  return router;
}



