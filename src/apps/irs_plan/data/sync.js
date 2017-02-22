// TODO: @refac None of this belongs in a Sync file - should be all in a remote file.
// 
// Called by $store, coordinates local and remote activity
import LocalDB from '../../../lib/local.js'
import RemoteDBClass from '../../../lib/remote.js'

class Sync {

  constructor() {
    this.R_SERVER_URL = 'http://35.187.40.238:3000'
    // this.R_SERVER_URL = 'http://localhost:3000'
  }

  config(demo_instance_id) {
    this.demo_instance_id = demo_instance_id
    this.RemoteDB = new RemoteDBClass(this.demo_instance_id)
  }

  // Get OperationalUnits for given country_code
  get_ous(country_code) {
    // TODO: @refac Cache offline assets better - ServiceWorker?
    let ous
    const country_key = `douma-${country_code}-ous`

    try { ous = JSON.parse(localStorage.getItem(country_key)) }
    catch (err){
      ous = null
      localStorage.setItem(country_key, null)
    }

    if(ous) return Promise.resolve(ous)

    const url = this.R_SERVER_URL + `/localities/${country_code.toLowerCase()}.geojson`

    return fetch(url, {mode: 'cors'})
      .then(res => res.json())
      .then(json => {
        localStorage.setItem(country_key, JSON.stringify(json))
        return json
      })
      .catch(err => console.error(err))
  }

  get_clusters(country_code) {
    return this.RemoteDB.read_clusters()
  }

  cluster_yourself(parameters) {
    const url = this.R_SERVER_URL + '/clusters'

    const options = {
      body: JSON.stringify({...parameters}), 
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      method: 'POST'
    }
    return fetch(url, options)
      .then((res) => {
        return res.json()
      })
  }

}

export default new Sync()