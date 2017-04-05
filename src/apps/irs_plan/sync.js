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

  get_all_clusters(country_code) {
    return this.RemoteDB.get_all_clusters(country_code)
  } 

  post_clusters(options) {
    return this.RemoteDB.post_clusters(options)
  }

}

export default new Sync()
