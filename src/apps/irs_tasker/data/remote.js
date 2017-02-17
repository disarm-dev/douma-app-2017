// Manages remote DB calls

class RemoteDBClass {
  constructor(team_id){
    this.team_id = team_id
  }

  read_clusters(filters) {
    let url = DOUMA_API_URL
    if (filters.locations) {
      const params = JSON.stringify(filters.locations)
      url = url + `/clusters?locations=${params}&team_id=${this.team_id}`
    } else if (filters.cluster_ids) {
      const params = JSON.stringify(filters.cluster_ids)
      url = url + `/clusters?ids=${params}&team_id=${this.team_id}`
    }

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