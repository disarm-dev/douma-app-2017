import {get_instance_files} from './remote/remote'

function get_hash_value(key) {
  const matches = location.hash.match(new RegExp(key+'=([^&]*)'));
  return matches ? matches[1] : null;
}

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
 * - neither of the above, but already something found in sessionStorage
 * - nothing. error
 * @returns String {instance_slug}
 */
function determine_instance() {
  let instance_slug = null

  const subdomain = get_subdomain_if_not_local()
  const instance_hash = get_hash_value('instance')
  const instance_sessionStorage = sessionStorage.getItem("DOUMA_DEBUG_INSTANCE_SLUG")

  if (instance_hash) {
    console.warn('🐞 Received instance_slug in URL hash - temporarily persisting to sessionStorage')
    sessionStorage.setItem('DOUMA_DEBUG_INSTANCE_SLUG', instance_hash)
    instance_slug = instance_hash
  } else if (subdomain) {
    sessionStorage.removeItem('DOUMA_DEBUG_INSTANCE_SLUG')
    instance_slug = subdomain
  } else if (instance_sessionStorage) {
    console.warn('🐞 Found instance_slug in sessionStorage')
    instance_slug = instance_sessionStorage
  } else {
    const msg = `You might be looking for an application which does not exist. Cannot find instance id in subdomain or hash ('#instance=xxx'). `
    alert(msg)
    throw new Error(msg)
  }

  return instance_slug
}

function get_instance_config () {
  const instance_slug = determine_instance()

  return get_instance_files(instance_slug) // TODO: @refac Move this instance configuration from `static` to somewhere better
    .then(res => {
      if (res.status === 404) {
        const msg = `You might be looking for an application which does not exist. Cannot find application configuration file for subdomain "${instance_slug}". `
        alert(msg)
        return new Error(msg)
      }
      return res
    })
}


export {get_instance_config}
