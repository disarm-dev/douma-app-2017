// TODO: @refac None of this belongs in a Sync file - should be all in a remote file.
// 
// Called by $store, coordinates local and remote activity
import geobuf from "geobuf";
import Pbf from "pbf";

import LocalDB from '../../lib/local.js'
import RemoteDBClass from '../../lib/remote.js'

class Sync {

  constructor() {
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

    const url = R_SERVER_URL + `/local_areas/${country_code.toLowerCase()}.geojson`

    return fetch(url, {mode: 'cors'})
      .then(res => res.json())
      .then(json => {
        localStorage.setItem(country_key, JSON.stringify(json))
        return json
      })
      .catch(err => console.error(err))
  }

  cluster_yourself_pbf(parameters) {
    const url = R_SERVER_URL + '/clusters/pbf'

    const options = {
      body: JSON.stringify({...parameters}), 
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      method: 'POST'
    }

    return fetch(url, options).then((response) => {

      if (!response.ok) {
        return console.log('error')
      }

      return response.blob().then(blob => {
        var reader = new FileReader()
        return new Promise(resolve => {
          reader.addEventListener("loadend", () => {
            var pbf = new Pbf( reader.result )
            return resolve(geobuf.decode(pbf))
          })
          reader.readAsArrayBuffer(blob)
        })
      })
    })
  }

  cluster_yourself(parameters) {
    const url = R_SERVER_URL + '/clusters'

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

  post_clusters(clusters) {
    return this.RemoteDB.post_clusters(clusters)
  }

}

export default new Sync()