import CONFIG from 'config/common'
import {retrieve_stored_param} from 'lib/helpers/hash_params'

export function get_api_url() {
  return retrieve_stored_param(CONFIG.hash_params.API_URL) || CONFIG.api.url
}