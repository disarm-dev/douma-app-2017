import Vue from 'vue'
import Acl from 'vue-browser-acl'
import {store} from 'apps/store'

function has_permission (permission) {
  return (user) => user.permissions.includes(permission)
}

function get_user () {
  return store.state.meta.user || {permissions: []}
}

export function setup_acl() {
  Vue.use(Acl, get_user, (acl) => {
    acl.rule('read', 'irs_record_point', has_permission('read:irs_record_point'))
  })
}