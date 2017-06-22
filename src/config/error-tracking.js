import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

export function configure_error_tracking (){
// Keep track of Errors
  if (process.env.NODE_ENV !== 'development') {
    Raven
      .config('https://05f42524abca4b84ba7a9b9d05fb620a@sentry.io/134727')
      .addPlugin(RavenVue, Vue)
      .install()
    Raven.setExtraContext({DOUMA_version: COMMIT_HASH})
  }
}
