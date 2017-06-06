import axios from 'axios'

// Manage interaction with DOUMA API

let douma_api_root = `${DOUMA_API_URL}/${DOUMA_API_VERSION}`

const standard_handler = (url, options = {}) => {
  options.url = url
  return new Promise((resolve, reject) => {
    axios(options)
      .then(json => resolve(json.data))
      .catch(error => reject(error))
  })
}

// Get instance config

export const get_instance_config = (instance) => {
  let url = `/static/instances/${instance}.instance.json`
  return standard_handler(url)
}

//
// User authentiction
//
export const authenticate = (user) => {
  let url = douma_api_root + `/auth`

  let options = {
    body: JSON.stringify({user}),
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    method: 'POST'
  }
  return standard_handler(url, options)
}


// PLANS

export const get_current_plan = (country) => {
  let url = douma_api_root + `/plan/current?country=${country}`

  return standard_handler(url)
}

export const create_plan = (plan) => {
  let url = douma_api_root + `/plan/create`

  let options = {
    body: JSON.stringify(plan),
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    method: 'POST'
  }

  return standard_handler(url, options)
}


// RECORDS

export const get_all_records = (country) => {
  let url = douma_api_root + `/record/all?country=${country}`

  return standard_handler(url)
}

export const create_record = (record) => {
  let url = douma_api_root + `/record/create`

  let options = {
    body: JSON.stringify(record),
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    method: 'POST'
  }

  return standard_handler(url, options)
}


// GEODATA

export const get_geodata = ({slug, level, cache}) => {
  const urls = [
    `/static/geo/${slug}/spatial_hierarchy/${slug}.${level}.geojson`,
    `/static/geo/${slug}/spatial_hierarchy/${slug}.clusters.geojson`
  ]

  return Promise.all(urls.map(url => standard_handler(url)))
    .then(jsons => {
      cache.geodata.all_target_areas = jsons[0]
      cache.geodata.clusters = jsons[1]
    })

}
