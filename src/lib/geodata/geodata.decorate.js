import cache from 'config/cache'
import {geodata_valid} from 'lib/geodata/geodata.valid'
import {get_all_spatial_hierarchy_level_names, get_display_name_for_level, get_field_name_for_level} from 'lib/geodata/spatial_hierarchy_helper'
window.g = cache.geodata

const decorate_geodata = () => {
  if (!geodata_valid()) {
    throw new Error('Invalid geodata')
  }

  const level_names = get_all_spatial_hierarchy_level_names()

  level_names.forEach(level_name => decorate_level(level_name))

}

function decorate_level(level_name) {
  const field_name = get_field_name_for_level(level_name)
  const display_name = get_display_name_for_level(level_name)

  const level = cache.geodata[level_name]

  const decorated_level_features = level.features.map(feature => {
    feature.properties.__disarm_geo_id = feature.properties[field_name]
    feature.properties.__disarm_geo_name = feature.properties[display_name]
    return feature
  })

  cache.geodata[level_name].features = decorated_level_features
}

export {decorate_geodata}
