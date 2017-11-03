import CONFIG from 'config/common'

export function load_api_url() {
  const hash_key = CONFIG.hash_params.API_URL
  return get_hash_value(hash_key)
}