import {get_version} from 'lib/remote/remote.standard-handler'

const need_to_update = () => {
  return get_version().then((live_version) => {
    if (live_version && (live_version !== VERSION_COMMIT_HASH_SHORT)) {
      console.log(`🎉 New version available: ${live_version} (currently have ${VERSION_COMMIT_HASH_SHORT}}`)
      return 'CAN_UPDATE'
    } else {
      return 'ON_LATEST'
    }
  }).catch(err => {
    console.error(`Error checking for new VERSION: ${err}`)
    return "NO_RESPONSE"
  })
}

export {need_to_update}
