export default (douma_app) => {
  window.addEventListener('online', () => douma_app.$store.commit('root:network_online', true))
  window.addEventListener('offline', () => douma_app.$store.commit('root:network_online', false))
  douma_app.$store.commit('root:network_online', navigator.onLine)
}
