// Manages remote DB calls

class RemoteDBClass {
  constructor(team_id){
    this.team_id = team_id
  }

  read_clusters(filters) {
    let url = DOUMA_API_URL + '/clusters'

    console.log('fetch', url)
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => res.json())
        .then(json => {
          resolve(json.data)            
        })
        .catch((error) => reject(error))
    })
  }
}

export default RemoteDBClass