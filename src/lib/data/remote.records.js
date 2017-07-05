import {standard_handler, douma_api_root} from './remote.standard-handler.js'

// RECORDS
export const get_all_records = (country) => {
  let url = douma_api_root + `/record/all?country=${country}`

  return standard_handler(url)
}

export const create_records = (records) => {
  let url = douma_api_root + `/record/create_multiple`

  let options = {
    timeout: 20000,
    data: records,
    method: 'post'
  }

  return standard_handler(url, options)
}
