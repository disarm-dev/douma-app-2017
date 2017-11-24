import Vue from 'vue'
import Acl from 'vue-browser-acl'
import {store} from 'apps/store'
import {router} from 'apps/router'

function get_user () {
  return store.state.meta.user || {permissions: []}
}

export function setup_acl() {
  Vue.use(Acl, get_user, (acl) => {
    const permissions = get_user().permissions

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