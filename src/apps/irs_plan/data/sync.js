// TODO: @refac None of this belongs in a Sync file - should be all in a remote file.
// 
// Called by $store, coordinates local and remote activity
import LocalDB from '../../../lib/local.js'
import RemoteDBClass from '../../../lib/remote.js'

class Sync {

  constructor() {
    this.R_SERVER_URL = 'http://35.187.40.238:3000'
  }

  config(demo_instance_id) {
    this.demo_instance_id = demo_instance_id
  }

  // Get OperationalUnits for given country_code
  get_ous(country_code) {
    // let ous = JSON.parse(localStorage.getItem(`douma-${country_code}-ous`))

    // if(ous) return new Promise((resolve, reject) => resolve(ous))

    const url = this.R_SERVER_URL + `/localities?country_code=${country_code}`

    return fetch(url, {mode: 'cors'})
      .then(res => res.json())
      // .then(json => {
        // console.log('save to localStorage')
        // return JSON.stringify(localStorage.setItem(`douma-${country_code}-ous`, json))
      // })
      .catch(err => console.error(err))
  }

  get_clusters(parameters) {
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
      }).catch(err => {
        console.log("Some error instead")
        console.error(err)
      })
  }

}

export default new Sync()