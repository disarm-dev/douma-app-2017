import RemoteDBClass from '../../lib/remote.js'

class Sync {

  config(demo_instance_id) {
    this.RemoteDB = new RemoteDBClass(demo_instance_id)
  }

  get_ous(country_code) {
    // TODO: @refac Cache offline assets better - ServiceWorker?
    let local_ous
    const country_key = `douma-${country_code}-ous`

    try {
      local_ous = JSON.parse(localStorage.getItem(country_key))
    } catch (err){
      local_ous = null
      localStorage.setItem(country_key, null)
    }

    if(local_ous) return Promise.resolve(local_ous)

    return this.RemoteDB.get_ous(country_code)
  }

  post_clusters(options) {
    return this.RemoteDB.post_clusters(options)
  }

}

export default new Sync()
