import RemoteDBClass from '../../lib/remote.js'
import prepare_formal_areas from '../../lib/formal_areas.js'

class Sync {

  config(demo_instance_id) {
    this.RemoteDB = new RemoteDBClass(demo_instance_id)
  }

  get_ous(country_code) {
    // TODO: @refac Cache offline assets better - ServiceWorker?
    let results
    const country_localstorage_key = `douma-${country_code}-ous`

    try {
      results = JSON.parse(localStorage.getItem(country_localstorage_key))
    } catch (err){
      results = null
      localStorage.setItem(country_localstorage_key, null)
    }

    if(results) {
      results = prepare_formal_areas(results, country_code)
      return Promise.resolve(results)
    }

    return this.RemoteDB.get_ous(country_code).then((results) => {
      const formal_areas = prepare_formal_areas(results, country_code)
      localStorage.setItem(country_localstorage_key, formal_areas)
      return formal_areas
    })

  }

  post_clusters(options) {
    return this.RemoteDB.post_clusters(options)
  }

  delete_clusters() {
    return this.RemoteDB.delete_clusters()
  }

}

export default new Sync()
