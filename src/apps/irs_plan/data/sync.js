// TODO: @refac None of this belongs in a Sync file - should be all in a remote file.
// 
// Called by $store, coordinates local and remote activity
import LocalDB from '../../../lib/local.js'
import RemoteDBClass from '../../../lib/remote.js'

import localities from './localities.json'

class Sync {

  constructor() {
    this.R_SERVER_URL = 'http://35.187.40.238:3000'
  }

  config(team_id) {
    this.team_id = team_id
  }

  // Get all clusters
  get_localities(country_code) {
    // const url = this.R_SERVER_URL + `/localities?country_code=ZWE`

    // return fetch(url)
    //   .then(res => res.json())
    //   .catch(err => console.error(err))

    return new Promise((resolve, reject) => resolve(localities))

  }

  get_clusters(parameters) {
    // const url = this.R_SERVER_URL + '/clusters'
    const url = 'http://localhost:3000' + '/clusters'

    const options = {
      body: JSON.stringify({...parameters}), 
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      method: 'POST'
    }

    return fetch(url, options)
      // .then((res) => {
      //   return res.json()
      // }).catch(err => {
      //   console.log("Some error instead")
      //   console.error(err)
      // })


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