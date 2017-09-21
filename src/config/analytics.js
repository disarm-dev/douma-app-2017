// Configure Google Analytics on router for page-tracking only for production
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

const instantiate_analytics = (router) => {
  if (DOUMA_PRODUCTION_MODE) {
    Vue.use(VueAnalytics, {
      id: GA_ANALYTICS_UA,
      router
    })
  } else {
    const fake_plugin = {
      install(Vue, options) {
        Vue.prototype.$ga = {
          event() {},
          set() {},
          fake_plugin: true
        }
      }
    }
    Vue.use(fake_plugin)
  }
}

const set_common_analytics = (app) => {
  app.$ga.set('dimension1', VERSION_COMMIT_HASH_SHORT)
  app.$ga.set('dimension2', app.$store.state.instance_config.instance.slug)

  // Set username/name if exists
  if (app.$store.state.user) {
    app.$ga.set("dimension3", `${app.$store.state.user.username}/${app.$store.state.user.name}`)
  }
}

export {instantiate_analytics, set_common_analytics}
