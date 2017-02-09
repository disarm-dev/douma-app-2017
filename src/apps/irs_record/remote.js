// Manages remote DB calls

const clusters = {
  read: (filters) => {
    let url = ''
    if (filters.locations) {
      const params = JSON.stringify(filters.locations)
      url = DOUMA_API_URL + `/clusters?locations=${params}`
    } else if (filters.cluster_ids) {
      const params = JSON.stringify(filters.cluster_ids)
      url = DOUMA_API_URL + `/clusters?ids=${params}`
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
  read_tasks: (task_ids) => {},
  update_task: (task) => {}
}

const spatial_entities = {
  read_spatial_entities: () => {}
}


export default { clusters, tasks, spatial_entities }