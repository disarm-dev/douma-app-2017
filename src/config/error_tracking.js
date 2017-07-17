import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import get from 'lodash.get'

const configure_error_tracking = ()=> {
// Keep track of Errors
  if (process.env.NODE_ENV !== 'development') {
    Raven
      .config('https://05f42524abca4b84ba7a9b9d05fb620a@sentry.io/134727', {
        release: VERSION_COMMIT_HASH_SHORT
      })
      .addPlugin(RavenVue, Vue)
      .install()
  }
}

// Add extra info to error logging
const set_raven_user_context = (state) => {

  const user_context = {
    instance_slug: state.instance_config.instance.slug,
    personalised_instance_id: state.meta.personalised_instance_id,
    user: state.meta.user
  }

  Raven.setUserContext(user_context)
}

export {configure_error_tracking, set_raven_user_context}
