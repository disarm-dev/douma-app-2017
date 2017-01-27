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
    meta: {
      title: 'Profile'
    }
  },
  {
    path: 'login',
    name: 'meta:login',
    component: Login,
    meta: {
      title: 'Login'
    }
  },
  { 
    path: 'logout',
    name: 'meta:logout',
    component: Logout,
    meta: {
      title: 'Logout'
    }
  },
  { 
    path: 'reset_password',
    name: 'meta:resetpassword',
    component: ResetPassword,
    meta: {
      title: 'Reset password'
    }
  },
  { 
    path: 'newuser',
    name: 'meta:newuser',
    component: NewUser,
    meta: {
      title: 'Sign up'
    }
  },
  {
    path: 'sync',
    name: 'meta:sync',
    component: SyncStatus,
    meta: {
      title: 'Sync'
    }
  },
  {
    path: 'aoi',
    name: 'meta:aoi',
    component: AOIMap,
    meta: {
      title: 'AOI'
    }
  }
]

export default meta