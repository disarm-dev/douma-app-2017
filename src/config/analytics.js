// Configure Google Analytics on router for page-tracking only for production
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

const instantiate_analytics = (router) => {
  if (DOUMA_PRODUCTION_MODE) {
    Vue.use(VueAnalytics, {
      id: 'UA-88844641-2',
      router
    })
  } else {
    const fake_plugin = {
      install(Vue, options) {
        Vue.prototype.$ga = {
          event() {},
          set() { }
        }
      }
    }
    Vue.use(fake_plugin)
  }
}

const set_common_analytics = (app) => {
  app.$ga.set('commit_hash', COMMIT_HASH)
  app.$ga.set('instance_slug', app.$store.state.instance_config.instance.slug)

  // Set username/name if exists
  if (app.$store.state.meta.user) {
    app.$ga.set("user", `${app.$store.state.meta.user.username}/${app.$store.state.meta.user.name}`)
  }
}

export {instantiate_analytics, set_common_analytics}
