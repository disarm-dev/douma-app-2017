const get_planning_level_id_field = (instance_config) => {
  const planning_level_name = instance_config.spatial_hierarchy.markers.planning_level_name // e.g. villages for NAM
  const planning_level = instance_config.spatial_hierarchy.levels.find(sp => sp.name === planning_level_name)

  if (planning_level && planning_level.hasOwnProperty('field_name')) {
    return planning_level.field_name
  } else {
    throw new Error(`Cannot find field_name for planning_level ${planning_level_name}`)
  }
}

const get_planning_level_name = (instance_config) => {
  const planning_level_name = instance_config.spatial_hierarchy.markers.planning_level_name // e.g. villages for NAM
  const planning_level = instance_config.spatial_hierarchy.levels.find(sp => sp.name === planning_level_name)
  return planning_level.name
}

const get_denominator_fields = (instance_config) => {
  return instance_config.spatial_hierarchy.markers.denominator_fields
}

const get_all_spatial_hierarchy_levels = (instance_config) => {
  return instance_config.spatial_hierarchy.levels.map(level => level.name)
}

export {get_planning_level_id_field, get_denominator_fields, get_planning_level_name, get_all_spatial_hierarchy_levels}

