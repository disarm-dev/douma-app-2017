import offline from 'offline-js'


export default (douma_app) => {
  // Brute-force, probably not used often

  window.addEventListener('online', () => set_online(douma_app))
  window.addEventListener('offline', () => set_offline(douma_app))

  // Offline JS
  Offline.options = {
    checks: {
      xhr: {
        url: '/static/network_test.txt'
      }
    },
    requests: false
  };
  Offline.on('up', () => set_online(douma_app))
  Offline.on('down', () => set_offline(douma_app))
  console.log('initial', Offline.check().offline)
}

function set_online(douma_app) {
  console.log('online')
  return douma_app.$store.commit('root:network_online', true)
}

function set_offline(douma_app) {
  console.log('online')
  return douma_app.$store.commit('root:network_online', false)
}
