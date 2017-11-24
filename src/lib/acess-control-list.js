import Vue from 'vue'
import Acl from 'vue-browser-acl'
import {store} from 'apps/store'
import {router} from 'apps/router'

export function setup_acl() {
  const user = store.state.meta.user
  if (!user) return

  Vue.use(Acl, user, (acl) => {
    const permissions = user.permissions

    for (const permission of permissions) {
      if (!permission.includes(':')) break

      const permission_split = permission.split(':')
      if (permission_split.length !== 2) break

      const verb = permission_split[0]
      const applet = permission_split[1]
      acl.rule(verb, applet)
    }
  }, {router})
}