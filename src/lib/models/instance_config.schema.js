// Schema for the raw `instance_config.json` file, not the one with `form` and `location_selection` added

import schema from 'js-schema'

const base_schema = {
  '?title': String,
  '?icon': String,
}

const IrsMonitorSchema = schema({
  ...base_schema,
  aggregations: {
    map: String,
    table: Array.of_x(1, Infinity, String)
  },
  components: Array.of_x(1, Infinity, {
    height_constraint: ['none', 'viewport'],
    name: String,
    width_constraint: ['half', 'full']
  })
})

const IrsPlanSchema = schema({
  ...base_schema,
  // default_planning_level: String // One of the spatial_hierarchy `name` fields
})
const IrsRecordPointSchema = schema({...base_schema})
const IrsTaskerSchema = schema({...base_schema})
const MetaSchema = schema({...base_schema})

const AppletSchema = schema({
  '?irs_monitor': IrsMonitorSchema,
  '?irs_plan': IrsPlanSchema,
  '?irs_record_point': IrsRecordPointSchema,
  '?irs_tasker': IrsTaskerSchema,
  meta: MetaSchema
})

const SpatialHierarchySchema = schema({
  field_name: String,
  name: String
})

export const InstanceConfigSchema = schema({
  applets: AppletSchema,
  map_focus: {
    centre: {
      lat: Number,
      lng: Number
    },
    zoom: Number
  },
  name: String,
  slug: String,
  spatial_hierarchy: {
    markers: {
      planning_level_name: String,
      denominator_fields: Object
    },
    levels: Array.of_x(1, Infinity, SpatialHierarchySchema),
  }
  // TODO: @fix Don't currently have a way to validate the denominator on spatial_hierarchy - could do as separate property
  // denominator_units: {
  //   physical: {
  //     id_field: String, // e.g. number_of_structures
  //     enumerable: String // e.g "structure"
  //   },
  //   human: {
  //     id_field: String,
  //     enumerable: String
  //   },
  // },
})
