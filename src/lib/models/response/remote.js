import {standard_handler, douma_api_root} from '../../remote/standard-handler.js'

export const create = (records) => {
  const url = douma_api_root + `/record/create`

  const options = {
    timeout: 20000,
    data: records,
    method: 'post'
  }

  return standard_handler(url, options)
}

export const read_all = () => {
  const url = douma_api_root + `/record/all`

  return standard_handler(url)
}

export default {create, read_all}