import {nest} from 'd3-collection'

import {
  get_all_spatial_hierarchy_levels, get_field_name_for_level,
  get_planning_level_name
} from "lib/instance_data/spatial_hierarchy_helper"
import cache from "config/cache"


export function get_targets(targets, spatial_aggregation_level) {
  const planning_level_name = get_planning_level_name()

  if (spatial_aggregation_level === planning_level_name) {
    // Spatial aggregation level is the same as the planning_level so we return the targets
    return targets
  }

  const decorated_targets = decorate_t
  argets(targets)
  const binned_targets = get_binned_targets(decorated_targets)
  const aggregated_targets = get_aggregated_targets(binned_targets)
  console.log('aggregated_targets', aggregated_targets)
  return aggregated_targets
}

function decorate_targets(targets) {
  const planning_level_name = get_planning_level_name()
  const levels = get_all_spatial_hierarchy_levels()

  const planning_level = levels.find(l => l.name === planning_level_name)

  const category_field = planning_level.group_by_field

  // Find out which level above each target is in
  // Find the planning_level feature and get the category from that
  // get planning_level.group_by_field of each

  const field_name = get_field_name_for_level(planning_level_name)

  const decorated_targets = targets.map(t => {
    const feature = cache.geodata[planning_level_name].features.find(feature => {
      return feature.properties[field_name] == t.id
    })

    t.category = feature.properties[category_field]
    return t
  })

  return decorated_targets
}

function get_binned_targets (targets) {

  const binned_targets = nest()
    .key(t => t.category)
    .entries(targets)

  return binned_targets
}


function get_aggregated_targets(binned_targets) {
  const aggregated_targets = []

  for (const bin of binned_targets) {
    const new_target = {
      id: bin.key,
      ['estimated_rooms']: 1 // replace with loop
    }

    aggregated_targets.push(new_target)
  }

  return aggregated_targets
}