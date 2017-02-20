// TODO: @refac None of this belongs in a Sync file - should be all in a remote file.
// 
// Called by $store, coordinates local and remote activity
import LocalDB from '../../../lib/local.js'
import RemoteDBClass from '../../../lib/remote.js'

// import localities from './localities.json'

class Sync {

  constructor() {
    this.R_SERVER_URL = 'http://35.187.40.238:8080'
    this.R_SERVER_URL = 'http://localhost:3001'
  }

  config(demo_instance_id) {
    this.demo_instance_id = demo_instance_id
  }

  // Get all clusters
  get_ous(country_code) {
    // const url = this.R_SERVER_URL + `/localities?country_code=${country_code}`

    // return fetch(url, {mode: 'cors'})
    //   .then(res => res.json())
    //   .catch(err => console.error(err))
    const localities = require('./localities.json')
    return new Promise((resolve, reject) => resolve(localities))
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


    // return new Promise((resolve, reject) => {
    //   var data = JSON.stringify(parameters);
    //   var xhr = new XMLHttpRequest();
    //   xhr.withCredentials = true;

    //   xhr.addEventListener("readystatechange", function () {
    //     if (this.readyState === this.DONE) {
    //       resolve(this.responseText)
    //     }
    //   });

    //   xhr.open("POST", url, true);
    //   xhr.setRequestHeader("content-type", "application/json");

    //   xhr.send(data);
    // })
  }

}

export default new Sync()