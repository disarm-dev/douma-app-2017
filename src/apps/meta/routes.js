import MetaApplet from './meta_applet.vue'

import Profile from './pages/user/profile.vue'
import Login from './pages/user/login.vue'
import Logout from './pages/user/logout.vue'
import ResetPassword from './pages/user/resetPassword.vue'
import NewUser from './pages/user/newUser.vue'

import MetaDebug from './pages/debug.vue'

const meta = [
  {
    path: '/meta',
    redirect: '/meta/profile',
    name: 'meta',
    meta: {title: 'User', icon: 'person'},
    component: MetaApplet,
    children: [
      {
        path: 'profile',
        name: 'meta:profile',
        component: Profile,
        meta: {title: 'Profile'}
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
      }
    ]
  }, {
    path: '/meta/debug',
    component: MetaDebug
  }
]

export default meta