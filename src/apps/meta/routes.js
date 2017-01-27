import Profile from './user/profile.vue'
import Login from './user/login.vue'
import Logout from './user/logout.vue'
import ResetPassword from './user/resetPassword.vue'
import NewUser from './user/newUser.vue'
import SyncStatus from './sync/status.vue'
import AOIMap from './aoi/map.vue'

const meta = [
  {
    path: 'profile',
    name: 'meta:profile',
    component: Profile,
  },
  {
    path: 'login',
    name: 'meta:login',
    component: Login
  },
  { 
    path: 'logout',
    name: 'meta:logout',
    component: Logout
  },
  { 
    path: 'reset_password',
    name: 'meta:resetpassword',
    component: ResetPassword
  },
  { 
    path: 'newuser',
    name: 'meta:newuser',
    component: NewUser
  },
  {
    path: 'sync',
    name: 'meta:sync',
    component: SyncStatus
  },
  {
    path: 'aoi',
    name: 'meta:aoi',
    component: AOIMap
  }
]

export default meta