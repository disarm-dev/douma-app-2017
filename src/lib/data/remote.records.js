import {standard_handler, douma_api_root} from './remote.standard-handler.js'

// RECORDS
export const get_all_records = () => {
  let url = douma_api_root + `/record/all`

  return standard_handler(url)
}

export const create_records = (records) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (Math.random() > 0.5) ? resolve(records) : reject(records)
    }, 2000)
  })




  let url = douma_api_root + `/record/create`

  let options = {
    timeout: 20000,
    data: records,
    method: 'post'
  }


  return standard_handler(url, options)
}
