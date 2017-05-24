// Manage interaction with DOUMA API

export default class {
  constructor(){
    this.douma_api_root = `${DOUMA_API_URL}/${DOUMA_API_VERSION}`
  }

  //
  // User authentiction
  //
  authenticate(user) {
    let url = this.douma_api_root + `/auth`

    let options = {
      body: JSON.stringify({user}),
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      method: 'POST'
    }
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(res => res.json())
        .then(json => {
          resolve(json)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }


}
