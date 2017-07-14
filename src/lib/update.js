import {get_version} from 'lib/data/remote.standard-handler'

const need_to_update = () => {
  return get_version().then((live_version) => {
    if (live_version && (live_version !== VERSION_COMMIT_HASH_SHORT)) {
      console.log(`🎉 New version available: ${live_version} (currently have ${VERSION_COMMIT_HASH_SHORT}}`)
      return true
    } else {
      return false
    }
  })
}

export {need_to_update}
