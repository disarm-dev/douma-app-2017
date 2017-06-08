import axios from 'axios'

const douma_api_root = `${DOUMA_API_URL}/${DOUMA_API_VERSION}`

// Create axios HTTP
const HTTP = axios.create()
HTTP.defaults.timeout = 5000
HTTP.interceptors.response.use(function (response) {
  window.dispatchEvent(new Event('online'))
  return response
}, function (error) {
  if (/timeout/.test(error.message)) {
    window.dispatchEvent(new Event('offline'))
  }
  return Promise.reject(error)
})


const standard_handler = (url, options = {}) => {
  options.url = url
  return HTTP(options)
    .then(json => json.data)
}

//
// Instance configuration and related files
//
export const get_all_instance_config = (slug) => {
  const urls = [
    `/static/instances/${slug}.instance.json`,
    `/static/instances/${slug}.form.json`,
    `/static/instances/${slug}.location_selector.json`,
  ]

  let options = {
    timeout: 20000
  }

  return Promise.all(urls.map(url => standard_handler(url, options)))
    .then(jsons => {
      let instance_config = jsons[0]

      const form = jsons[1]
      const location_selection = jsons[2]

      instance_config.form = form
      instance_config.location = location_selection

      return instance_config
    })

}



//
// User authentiction
//
export const authenticate = (user) => {
  let url = douma_api_root + `/auth`

  let options = {
    data: {user},
    method: 'post'
  }
  return standard_handler(url, options)
}


// PLANS

export const get_current_plan = (country) => {
  let url = douma_api_root + `/plan/current?country=${country}`
  let options = {timeout: 10000}
  return standard_handler(url, options)
}

export const create_plan = (plan) => {
  let url = douma_api_root + `/plan/create`

  let options = {
    data: plan,
    method: 'post',
    timeout: 10000
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
    data: record,
    method: 'post'
  }

  return standard_handler(url, options)
}


// GEODATA

export const get_geodata = ({slug, level, cache}) => {
  const urls = [
  `/static/geo/${slug}/spatial_hierarchy/${slug}.${level}.geojson`,
    `/static/geo/${slug}/spatial_hierarchy/${slug}.clusters.geojson`,
  ]

  let options = {
    timeout: 300000
  }

  return Promise.all(urls.map(url => standard_handler(url, options)))
    .then(jsons => {
      cache.geodata.all_target_areas = jsons[0]
      cache.geodata.clusters = jsons[1]
    })

}
