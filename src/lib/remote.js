// Manages remote DB calls

class RemoteDBClass {
  constructor(team_id){
    this.team_id = team_id
  }

  read_clusters(filters) {
    let url = DOUMA_API_URL + '/clusters' 
    if (filters.locations) {
      const params = JSON.stringify(filters.locations)
      url += `?locations=${params}`//&team_id=${this.team_id}`
    } else if (filters.cluster_ids) {
      const params = JSON.stringify(filters.cluster_ids)
      url += `?ids=${params}`//&team_id=${this.team_id}`
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

  update_clusters(clusters) {
    let url = DOUMA_API_URL + `/clusters?team_id=${this.team_id}`
    console.log(url)
  }

  read_tasks(filters) {
    let url = DOUMA_API_URL + '/tasks' 
    
    if (filters.task_ids) {
      const params = JSON.stringify(filters.task_ids)
      url += `?ids=${params}`//&team_id=${this.team_id}`
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

  update_tasks(tasks) {
    const url = DOUMA_API_URL + `/tasks`//?team_id=${this.team_id}`
    const options = {
      body: JSON.stringify(tasks), 
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      method: 'PUT'
    }
    return fetch(url, options)
      .then((res) => res.json()) 
  }

  read_spatial_entities(spatial_entity_ids) {
    const params = JSON.stringify(spatial_entity_ids)
    const url = DOUMA_API_URL + `/spatial_entities?ids=${params}`//&team_id=${this.team_id}`

    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => res.json())
        .then(json => {
          resolve(json.data)            
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  }
}

export default RemoteDBClass