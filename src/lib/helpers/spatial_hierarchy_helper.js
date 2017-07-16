/**
 * Something like 'AggUniCode' for SWZ or 'OBJECTID' for BWA
 * @param instance_config
 * @returns {*|string}
 */
let instance_config_cache = null

const configure_spatial_helpers = (instance_config) => {
  instance_config_cache = instance_config
}

const get_planning_level_id_field = () => {
  const planning_level_name = instance_config_cache.spatial_hierarchy.markers.planning_level_name // e.g. villages for NAM
  const planning_level = instance_config_cache.spatial_hierarchy.levels.find(sp => sp.name === planning_level_name)

  if (planning_level && planning_level.hasOwnProperty('field_name')) {
    return planning_level.field_name
  } else {
    throw new Error(`Cannot find field_name for planning_level ${planning_level_name}`)
  }
}

/**
 * Something like 'villages' for NAM for 'localities' for SWZ
 */
const get_planning_level_name = () => {
  const planning_level_name = instance_config_cache.spatial_hierarchy.markers.planning_level_name // e.g. villages for NAM
  const planning_level = instance_config_cache.spatial_hierarchy.levels.find(sp => sp.name === planning_level_name)
  return planning_level.name
}

const get_planning_level_display_name = () => {
  const planning_level_name = instance_config_cache.spatial_hierarchy.markers.planning_level_name // e.g. villages for NAM
  const planning_level = instance_config_cache.spatial_hierarchy.levels.find(sp => sp.name === planning_level_name)
  return planning_level.display_field_name
}


const get_denominator_fields = () => {
  return instance_config_cache.spatial_hierarchy.markers.denominator_fields
}

const get_all_spatial_hierarchy_levels = () => {
  return instance_config_cache.spatial_hierarchy.levels.map(level => level.name)
}

const get_top_level_hierarchy = () => {
  return instance_config_cache.spatial_hierarchy.levels[0]
}



/**
 * Try to get the next lowest spatial hierarchy: e.g. clusters for localities for SWZ
 * @returns a level {fieldname, name} or `false`
 */
const get_next_level_up_from_planning_level = () => {
  const planning_level_name = instance_config_cache.spatial_hierarchy.markers.planning_level_name
  const levels = instance_config_cache.spatial_hierarchy.levels

  const index = levels.findIndex(l => l.name === planning_level_name)

  return (levels[index - 1] || false)
}

/**
 * Try to get the next lowest spatial hierarchy: e.g. clusters for localities for SWZ
 * @returns a level {fieldname, name} or `false`
 */
const get_next_level_down_from_planning_level = () => {
  const planning_level_name = instance_config_cache.spatial_hierarchy.markers.planning_level_name
  const levels = instance_config_cache.spatial_hierarchy.levels

  const index = levels.findIndex(l => l.name === planning_level_name)

  return (levels[index + 1] || false)
}

export {
  configure_spatial_helpers,
  get_planning_level_id_field,
  get_denominator_fields,
  get_planning_level_name,
  get_planning_level_display_name,
  get_all_spatial_hierarchy_levels,
  get_next_level_up_from_planning_level,
  get_next_level_down_from_planning_level,
  get_top_level_hierarchy
}

