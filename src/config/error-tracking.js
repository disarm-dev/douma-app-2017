import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import get from 'lodash.get'

const configure_error_tracking = ()=> {
// Keep track of Errors
  if (process.env.NODE_ENV !== 'development') {
    Raven
      .config('https://05f42524abca4b84ba7a9b9d05fb620a@sentry.io/134727')
      .addPlugin(RavenVue, Vue)
      .install()
    Raven.setExtraContext({
      DOUMA_version: COMMIT_HASH
    })
  }
}

// Add extra info to error logging
const set_raven_user_context = (state) => {
  const user = get(state, 'meta.user', {})

  const user_context = {
    instance_slug: state.instance_config.instance.slug,
    personalised_instance_id: state.personalised_instance_id,
    user: user
  }

  Raven.setUserContext(user_context)
}

export {configure_error_tracking, set_raven_user_context}
