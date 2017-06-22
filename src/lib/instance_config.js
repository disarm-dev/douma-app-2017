import {get_instance_files} from './data/remote'

function get_hash_value(key) {
  const matches = location.hash.match(new RegExp(key+'=([^&]*)'));
  return matches ? matches[1] : null;
}

function determine_instance() {
  let instance = null

  const subdomain = document.domain.split('.')[0]
  const instance_hash = get_hash_value('instance')

  if (instance_hash) {
    instance = instance_hash
  } else if (subdomain) {
    instance = subdomain
  } else {
    const msg = `You might be looking for an application which does not exist. Cannot find instance id in subdomain or hash ('#instance=xxx'). `
    alert(msg)
    throw new Error(msg)
  }

  return instance
}
function get_instance_config () {
  const instance = determine_instance()

  return get_instance_files(instance) // TODO: @refac Move this instance configuration from `static` to somewhere better
    .then(res => {
      if (res.status === 404) {
        const msg = `You might be looking for an application which does not exist. Cannot find application configuration file for subdomain "${instance}". `
        alert(msg)
        return new Error(msg)
      }
      return res
    })
}

export {get_instance_config}
