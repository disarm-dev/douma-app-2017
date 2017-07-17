import get from 'lodash.get'

import cache from 'config/cache'
import {geodata_valid} from 'lib/geodata/geodata.valid'
import {get_all_spatial_hierarchy_levels} from './spatial_hierarchy_helper'

export const generate_location_selection = () => {
  if (!geodata_valid()) throw new Error('Invalid geodata')

  // Find the level with a `group_by_field`
  const all_levels = get_all_spatial_hierarchy_levels()
  const location_selection_level = all_levels.find(level => {
    return get(level, 'group_by_field', false)
  })
  if (!location_selection_level) throw new Error('Cannot find a named location selection level')

  // Get all the features from cache.geodata and extract the id and name, attach the category_field
  const level_features = cache.geodata[location_selection_level.name].features

  const categorised = level_features.map(feature => {
    return {
      id: feature.properties.__disarm_geo_id,
      name: feature.properties.__disarm_geo_name,
      category: feature.properties[location_selection_level.group_by_field]
    }
  })

  return categorised
}
