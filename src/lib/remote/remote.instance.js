import {standard_handler} from './remote.standard-handler.js'

/**
 * Get single instance file (currently from client server)
 * @param slug
 * @param type
 */
export const get_instance_file = (slug, type) => {
  if (!slug || !type) throw new Error(`Need both slug (${slug}) and type (${type}) to get an instance file`)

  const url = `/static/instances/${slug}/config/${slug}.${type}.json`
  // const url = `https://storage.googleapis.com/disarm-instance-config/${slug}/config/${slug}.${type}.json`

  let options = {
    timeout: 20000
  }
  return standard_handler(url, options)

}