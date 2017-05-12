// Manages remote DB calls

class RemoteDBClass {
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

//   // 
//   // CLUSTERS
//   // 
//   count_clusters(filters) {
//     let url = this.douma_api_root + `/clusters/count?demo_instance_id=${this.demo_instance_id}`
//     url += ('&query=' + JSON.stringify(filters))

//     return new Promise((resolve, reject) => {
//       fetch(url)
//         .then(res => res.json())
//         .then(json => {
//           resolve(json)            
//         })
//         .catch((error) => reject(error))
//     })
//   }

//   read_clusters(filters = {}) {
//     let url = this.douma_api_root + `/clusters?demo_instance_id=${this.demo_instance_id}`
//     if (filters.locations) {
//       const params = JSON.stringify(filters.locations)
//       url += `&locations=${params}`
//     } else if (filters.cluster_ids) {
//       const params = JSON.stringify(filters.cluster_ids)
//       url += `&ids=${params}`
//     }

//     return new Promise((resolve, reject) => {
//       fetch(url)
//         .then(res => res.json())
//         .then(json => {
//           resolve(json.data)            
//         })
//         .catch((error) => reject(error))
//     })
//   }

//   update_clusters(clusters) {
//     const url = this.douma_api_root + `/clusters?demo_instance_id=${this.demo_instance_id}`
//     const options = {
//       body: JSON.stringify(clusters), 
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       mode: 'cors',
//       method: 'PUT'
//     }
//     return fetch(url, options)
//       .then((res) => res.json()) 
//   }

//   post_clusters({cluster_ids, cluster_collection_id, country_code}) {
//     let url = this.douma_api_root + `/clusters?demo_instance_id=${this.demo_instance_id}`

//     let options = {
//       body: JSON.stringify({cluster_ids, cluster_collection_id, country_code}),
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       mode: 'cors',
//       method: 'POST'
//     }
//     return new Promise((resolve, reject) => {
//       fetch(url, options)
//         .then(res => res.json())
//         .then(json => {
//           resolve(json)            
//         })
//         .catch((error) => {
//           console.log(error)
//           reject(error)
//         })
//     })
//   }

//   delete_clusters() {
//     let url = this.douma_api_root + `/clusters?demo_instance_id=${this.demo_instance_id}`
//     let options = {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       mode: 'cors',
//       method: 'DELETE'
//     }
//     return new Promise((resolve, reject) => {
//       fetch(url, options)
//         .then(res => res.json())
//         .then(json => {
//           resolve(json)            
//         })
//         .catch((error) => {
//           console.log(error)
//           reject(error)
//         })
//     })
//   }


//   // 
//   // TASKS
//   //
//   get_tasks_for_cluster_ids(cluster_ids) {
//     let url = this.douma_api_root + `/clusters/tasks?demo_instance_id=${this.demo_instance_id}`
//     let options = {
//       body: JSON.stringify({cluster_ids}),
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       mode: 'cors',
//       method: 'POST',
//     }

//     return new Promise((resolve, reject) => {
//       fetch(url, options)
//         .then(res => res.json())
//         .then(json => {
//           resolve(json)            
//         })
//         .catch((error) => reject(error))
//     })
//   }

//   count_tasks(filters) {
//     let url = this.douma_api_root + `/tasks/count?demo_instance_id=${this.demo_instance_id}`
//     url += ('&query=' + JSON.stringify(filters))

//     return new Promise((resolve, reject) => {
//       fetch(url)
//         .then(res => res.json())
//         .then(json => {
//           resolve(json)            
//         })
//         .catch((error) => reject(error))
//     })
//   }

//   read_tasks(filters) {
//     let url = this.douma_api_root + `/tasks?demo_instance_id=${this.demo_instance_id}`
    
//     if (filters.task_ids) {
//       const params = JSON.stringify(filters.task_ids)
//       url += `&ids=${params}`
//     }

//     return new Promise((resolve, reject) => {
//       fetch(url)
//         .then(res => res.json())
//         .then(json => {
//           resolve(json.data)            
//         })
//         .catch((error) => reject(error))
//     })
//   }

//   update_tasks(tasks) {
//     const url = this.douma_api_root + `/tasks?demo_instance_id=${this.demo_instance_id}`
//     const options = {
//       body: JSON.stringify(tasks), 
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       mode: 'cors',
//       method: 'PUT'
//     }
//     return fetch(url, options)
//       .then((res) => res.json()) 
//   }

//   // 
//   // SPATIAL ENTITIES
//   // 
//   read_spatial_entities(filters) {
//     const params = JSON.stringify(filters.spatial_entity_ids)
//     let url = this.douma_api_root + `/spatial_entities?demo_instance_id=${this.demo_instance_id}`
//     url += `&ids=${params}`

//     return new Promise((resolve, reject) => {
//       fetch(url)
//         .then(res => res.json())
//         .then(json => {
//           resolve(json.data)            
//         })
//         .catch((error) => {
//           console.log(error)
//           reject(error)
//         })
//     })
//   }

//   //
//   // OPERATIONAL UNITS (OUs)
//   //
//   get_ous(country_code, country_ls_key){
//     const url = this.douma_api_root + `/local_areas/${country_code.toLowerCase()}`

//     return fetch(url, {mode: 'cors'})
//       .then(res => res.json())
//       .then(json => json)
//       .catch(err => console.error(err))
//   }


}

export default RemoteDBClass