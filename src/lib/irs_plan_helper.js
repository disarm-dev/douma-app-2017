import inside from '@turf/inside'
import centroid from '@turf/centroid'

import cache from 'config/cache'
import {get_planning_level_id_field, get_planning_level_name} from 'lib/spatial_hierarchy_helper'


const target_areas_inside_focus_filter_area = ({area_ids, selected_filter_area}) => {
  if (!Array.isArray(area_ids)) area_ids = [area_ids]
  if (!selected_filter_area) return area_ids

  const planning_level_name = get_planning_level_name()
  const planning_level_id_field = get_planning_level_id_field()

  const result = area_ids.filter(area_id => {
    const found_area = cache.geodata[planning_level_name].features.find(feature => {
      return feature.properties[planning_level_id_field] === area_id
    })

    if (!found_area) return false

    return inside(centroid(found_area), selected_filter_area)
  })
  return result
}

export {target_areas_inside_focus_filter_area}
