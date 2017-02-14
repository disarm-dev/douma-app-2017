import MetaApplet from './meta_applet.vue'

import Profile from './pages/user/profile.vue'
import Login from './pages/user/login.vue'
import Logout from './pages/user/logout.vue'
import ResetPassword from './pages/user/resetPassword.vue'
import NewUser from './pages/user/newUser.vue'
import SyncStatus from './pages/sync/status.vue'
import AOIMap from './pages/aoi/map.vue'

const meta = [
  {
    path: '/meta',
    redirect: '/meta/profile',
    name: 'meta',
    meta: {title: 'Meta', icon: 'person'},
    component: MetaApplet,
    children: [
      {
        path: 'profile',
        name: 'meta:profile',
        component: Profile,
        meta: {}
      },
      {
        path: 'login',
        name: 'meta:login',
        component: Login,
      },
      { 
        path: 'logout',
        name: 'meta:logout',
        component: Logout,
      },
      { 
        path: 'reset_password',
        name: 'meta:resetpassword',
        component: ResetPassword,
      },
      { 
        path: 'newuser',
        name: 'meta:newuser',
        component: NewUser,
      },
      {
        path: 'sync',
        name: 'meta:sync',
        component: SyncStatus,
      },
      {
        path: 'aoi',
        name: 'meta:aoi',
        component: AOIMap,
      }
    ]
  }
]

export default meta