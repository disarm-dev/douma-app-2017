import {get_version} from 'lib/remote/remote.standard-handler'

/**
 * @returns {string} 'CAN_UPDATE', 'ON_LATEST' or 'NO_RESPONSE'
 */
const need_to_update = () => {
  return get_version().then((remote_version) => {
    if (remote_version && (remote_version !== VERSION_COMMIT_HASH_SHORT)) {
      return {status: 'CAN_UPDATE', local_version: VERSION_COMMIT_HASH_SHORT, remote_version: remote_version}
    } else {
      return {status: 'ON_LATEST', local_version: VERSION_COMMIT_HASH_SHORT, remote_version: remote_version}
    }
  }).catch(err => {
    console.error(`Error checking for new VERSION: ${err}`)
    return {status: "NO_RESPONSE", local_version: VERSION_COMMIT_HASH_SHORT, remote_version: remote_version}
  })
}

export {need_to_update}
