/**
 * Something like 'AggUniCode' for SWZ or 'OBJECTID' for BWA
 * @param instance_config
 * @returns {*|string}
 */
let instance_config_cache = null
let spatial_hierarchy_cache = null

const configure_spatial_helpers = (instance_config) => {
  instance_config_cache = instance_config
  spatial_hierarchy_cache = instance_config.spatial_hierarchy
}

/**
 * Something like 'AggUniCode' or 'OBJECTID'
 * @returns {*|string}
 */
const get_planning_level_id_field = () => {
  const planning_level_name = spatial_hierarchy_cache.markers.planning_level_name
  const planning_level = spatial_hierarchy_cache.levels.find(sp => sp.name === planning_level_name)

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
  const planning_level_name = spatial_hierarchy_cache.markers.planning_level_name // e.g. villages for NAM
  const planning_level = spatial_hierarchy_cache.levels.find(sp => sp.name === planning_level_name)
  return planning_level.name
}



const get_planning_level_display_name = () => {
  const planning_level_name = spatial_hierarchy_cache.markers.planning_level_name // e.g. villages for NAM
  const planning_level = spatial_hierarchy_cache.levels.find(sp => sp.name === planning_level_name)
  return planning_level.display_field_name
}

const get_field_name_for_level = (level_name) => {
  const level = spatial_hierarchy_cache.levels.find(level => level.name === level_name)
  if (!level) throw new Error(`Cannot find level ${level_name} in instance_config.spatial_hierarchy.levels`)
  return level.field_name
}

const get_display_name_for_level = (level_name) => {
  const level = spatial_hierarchy_cache.levels.find(level => level.name === level_name)
  if (!level) throw new Error(`Cannot find level ${level_name} in instance_config.spatial_hierarchy.levels`)
  return level.display_field_name
}


const get_denominator_fields = () => {
  return spatial_hierarchy_cache.markers.denominator_fields
}

const get_all_spatial_hierarchy_levels = () => {
  return spatial_hierarchy_cache.levels
}

const get_all_spatial_hierarchy_level_names = () => {
  return spatial_hierarchy_cache.levels.map(level => level.name)
}

const get_level_by_name = (name) => {
  return spatial_hierarchy_cache.levels.find(level => level.name === name)
}

const get_top_level_hierarchy = () => {
  return spatial_hierarchy_cache.levels[0]
}

const get_record_location_selection = () => {
  const record_location_selection_level_name = spatial_hierarchy_cache.markers.record_location_selection_level_name
  return instance_config_cache.location_selection[record_location_selection_level_name]
}



/**
 * Try to get the next lowest spatial hierarchy: e.g. clusters for localities for SWZ
 * @returns a level {fieldname, name} or `false`
 */
const get_next_level_up_from_planning_level = () => {
  const planning_level_name = spatial_hierarchy_cache.markers.planning_level_name
  const levels = spatial_hierarchy_cache.levels

  const index = levels.findIndex(l => l.name === planning_level_name)

  return (levels[index - 1] || false)
}

/**
 * Try to get the next lowest spatial hierarchy: e.g. clusters for localities for SWZ
 * @returns a level {fieldname, name} or `false`
 */
const get_next_level_down_from_planning_level = () => {
  const planning_level_name = spatial_hierarchy_cache.markers.planning_level_name
  const levels = spatial_hierarchy_cache.levels

  const index = levels.findIndex(l => l.name === planning_level_name)

  return (levels[index + 1] || false)
}

export {
  configure_spatial_helpers,
  get_planning_level_id_field,
  get_denominator_fields,
  get_planning_level_name,
  get_planning_level_display_name,
  get_field_name_for_level,
  get_display_name_for_level,

  get_all_spatial_hierarchy_levels,
  get_all_spatial_hierarchy_level_names,
  get_level_by_name,
  get_record_location_selection,

  get_next_level_up_from_planning_level,
  get_next_level_down_from_planning_level,
  get_top_level_hierarchy
}
