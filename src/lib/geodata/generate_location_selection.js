import get from 'lodash.get'

import cache from 'config/cache'
import {geodata_valid} from 'lib/geodata/geodata.valid'
import {get_all_spatial_hierarchy_levels} from './spatial_hierarchy_helper'


export const generate_location_selection = () => {
  if (!geodata_valid()) throw new Error('Invalid geodata')

  const all_levels = get_all_spatial_hierarchy_levels()

  const location_selection_level = all_levels.find(level => {
    return (get(level, 'group_by_level', false) || get(level, 'group_by_field', false))
  })

  if (!location_selection_level) throw new Error('Cannot find a named location selection level')

  if (get(location_selection_level, 'group_by_level')) {
    return categorise_by_other_level(location_selection_level)
  } else  if (get(location_selection_level, 'group_by_field', false)) {
    return categorise_by_field(location_selection_level)
  }
}

function categorise_by_field(location_selection_level) {
  const category_field = location_selection_level.group_by_field
  const level_features = cache.geodata[location_selection_level.name].features

  const categorised = level_features.map(feature => {
    return {
      id: feature.properties.__disarm_geo_id,
      name: feature.properties.__disarm_geo_name,
      category: feature.properties[category_field]
    }
  })

  console.log('categorised', categorised)

  return categorised
}

function categorise_by_other_level(location_selection_level) {

}
