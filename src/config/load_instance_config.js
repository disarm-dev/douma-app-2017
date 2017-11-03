import {get_instance_files} from 'lib/instance_data/extend_instance_config'
import CONFIG from 'config/common'
import {get_hash_value} from 'lib/helpers/hash_value'

function get_subdomain_if_not_local() {
  const domain = document.domain
  const possible_subdomain = document.domain.split('.')[0]

  // Is 'localhost' - this isn't a subdomain
  if (['localhost'].includes(domain)) return false
  // Subdomain only contains numbers - unlikely to be one of ours
  if(/^[0-9]*$/.test(possible_subdomain)) return false

  return document.domain.split('.')[0]
}
/**
 * Order of checking:
 * - is in an explicit `#instance=nam` hash param on URL
 * - looks like a subdomain (not a number or 'localhost')
 * - neither of the above, but already something found in localStorage
 * - nothing. error
 * @returns String {instance_slug}
 */
function determine_instance() {
  let instance_slug = null

  const subdomain = get_subdomain_if_not_local()
  const hash_key = 'instance'
  const instance_hash = get_hash_value(hash_key)
  const instance_localStorage = localStorage.getItem("DOUMA_DEBUG_INSTANCE_SLUG")

  if (instance_hash && is_valid_subdomain(instance_hash )) {
    console.warn(`🐞 Received instance_slug ${instance_hash} in URL hash - temporarily persisting to localStorage`)
    localStorage.setItem('DOUMA_DEBUG_INSTANCE_SLUG', instance_hash)
    instance_slug = instance_hash
  } else if (subdomain && is_valid_subdomain(subdomain )) {
    localStorage.removeItem('DOUMA_DEBUG_INSTANCE_SLUG')
    instance_slug = subdomain
  } else if (instance_localStorage && is_valid_subdomain(instance_localStorage )) {
    console.warn(`🐞 Found instance_slug ${instance_localStorage} in localStorage`)
    instance_slug = instance_localStorage
  } else {
    const msg = `You might be looking for an application which does not exist. Cannot find instance id in subdomain or hash ('#instance=xxx'). `
    alert(msg)
    throw new Error(msg)
  }
  return instance_slug
}

/**
 * @returns Promise
 */
function get_instance_config () {
  const instance_slug = determine_instance()

  return get_instance_files(instance_slug)
    .then(res => {
      if (res.status === 404) {
        const msg = `You might be looking for an application which does not exist. Cannot find application configuration file for subdomain "${instance_slug}". `
        alert(msg)
        return new Error(msg)
      }
      return res
    })
}

function is_valid_subdomain(subdomain) {
  if(CONFIG.instances.list.includes(subdomain)) {
    return true
  } else {
    console.error(`Invalid subdomain: ${subdomain}`)
    return false
  }
}

export {get_instance_config}
