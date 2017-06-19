// Configure Google Analytics on router for page-tracking only for production
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

const configure_analytics = (router) => {
  if (DOUMA_DEV_MODE) {
    const fake_plugin = {
      install(Vue, options) {
        Vue.prototype.$ga = {
          event() {}
        }
      }
    }
    Vue.use(fake_plugin)
  } else {
    Vue.use(VueAnalytics, {
      id: 'UA-88844641-2',
      router
    })
  }
}

const configure_common_properties = (app) => {
  app.$ga.set('commit_hash', COMMIT_HASH)
  app.$ga.set('instance_slug', app.$store.state.instance_config.slug)

  // Set username/name if exists
  if (app.$store.state.meta.user) {
    app.$ga.set("user", `${app.$store.state.meta.user.username}/${app.$store.state.meta.user.name}`)
  }
}

export {configure_analytics, configure_common_properties}
