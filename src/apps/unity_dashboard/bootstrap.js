// Bootstrap the data for a 'unity' application to run inside existing DOUMA
// Needs to get both the data (e.g. from Dexie)
// and the configuration (e.g. from bwa.unity-config.json)
// Just returns them, doesn't do anything else.

import {unity} from './unity-integration'

/**
 * Has side-effect of loading data into imported unity store
 * @param dashboard_id
 * @returns {Promise<void>}
 */
export async function load_data_into_unity(dashboard_id) {
  // Bootstrap from data from a local JSON file or two

  // TODO: @unity .register_value(value_id, value) creates a value in the store

  unity.registerValue('responses_table', responses_table)
  unity.registerValue('targets_table', targets_table)
}


/**
 * Has side-effect of loading configuration into imported unity store
 * @param instance_slug
 * @returns {Promise<void>}
 */
export async function fetch_unity_configuration(instance_slug) {

  // Get configuration - this should be loaded with any other config files
  // are schemas defined as part of the configuration?
  try {
    const configuration = await fetch('/instance.unity-config.json')
  } catch (e) {
    throw new Error('Problem loading unity configuration')
  }

  unity.registerConfiguration('configuration', configuration) // TODO: @unity .register_configuration() stores the config in some store, non reactive
}
