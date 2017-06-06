export default (douma_app) => {
  function set_online() {
    console.log('online')
    return douma_app.$store.commit('root:network_online', true)
  }

  function set_offline() {
    console.log('offline')
    return douma_app.$store.commit('root:network_online', false)
  }

  window.addEventListener('online', set_online)
  window.addEventListener('offline', set_offline)

  douma_app.$store.commit('root:network_online', navigator.onLine)
}

