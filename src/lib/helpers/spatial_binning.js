import which_polygon from 'which-polygon'
import {nest} from 'd3-collection'
import {get} from 'lodash'

import {get_geodata_for_level_name} from "lib/helpers/geodata_helpers"
import {get_field_name_for_level} from "lib/instance_data/spatial_hierarchy_helper"

const AGGREGATION_FIELD = 'aggregation_field'


export function spatially_decorate_responses (responses, level_name) {
  // Get all responses - passed in

  // Get list of areas at a certain level
  const level_geodata = get_geodata_for_level_name(level_name)


  // Create spatial index

  const query = which_polygon(level_geodata)

  // We want the id field for that level
  const field_to_save = get_field_name_for_level(level_name)


  // For each response, query which area response is in
  for (const response of responses) {
    const {latitude, longitude} = response.location.coords
    const area = query([latitude, longitude])
    console.log('area', area)

    if (area) {
      response[AGGREGATION_FIELD] = area[field_to_save]
    }
  }

  // bin responses
  const binned_responses = spatial_bin(responses)

  return binned_responses
}


export function spatial_bin (responses) {
  const bins = nest()
    .key(f => get(f, AGGREGATION_FIELD))
    .entries(responses)

  return bins
}