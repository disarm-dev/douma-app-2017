// Manages remote DB calls

class RemoteDBClass {
  constructor(team_id){
    this.team_id = team_id
  }
}

const clusters = {
  read: (filters) => {
    let url = ''
    if (filters.locations) {
      const params = JSON.stringify(filters.locations)
      url = DOUMA_API_URL + `/clusters?locations=${params}&team_id=${this.team_id}`
    } else if (filters.cluster_ids) {
      const params = JSON.stringify(filters.cluster_ids)
      url = DOUMA_API_URL + `/clusters?ids=${params}&team_id=${this.team_id}`
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

const tasks = {
  read: (task_ids) => {
    const params = JSON.stringify(task_ids)
    const url = DOUMA_API_URL + `/tasks?ids=${params}`

    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => res.json())
        .then(json => {
          resolve(json.data)            
        })
        .catch((error) => reject(error))
    })
  },
  update_task: (task) => {}
}

const spatial_entities = {
  read: (spatial_entity_ids) => {
    const params = JSON.stringify(spatial_entity_ids)
    const url = DOUMA_API_URL + `/spatial_entities?ids=${params}`

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


// export default { clusters, tasks, spatial_entities }

export default RemoteDBClass