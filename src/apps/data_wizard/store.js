export default {
  namespaced: true,
  state: {
    instance_config: {
      map_focus: null,
      instance: {
        title: '',
        location_name: '',
        slug: ''
      },
      spatial_hierarchy: {
        data_version: 1,
        markers: {
          planning_level_name: "",
          record_location_selection_level_name: "",
          denominator_fields: {}
        },
        levels: []
      }
    },
    form: null,
    aggregations: null,
    validations: []
  },
  mutations: {
    // GEODATA
    'set_map_focus': (state, map_focus) => {
      state.instance_config.map_focus = map_focus
    },
    'set_instance': (state, instance) => {
      state.instance_config.instance = instance
    },
    'set_spatial_hierarchies': (state, spatial_hierarchies) => {
      console.log('Handle spatial_hierarchies')
      // state.instance_config.spatial_hierarchy = spatial_hierarchies
    },
    'set_planning_level': (state, planning_level) => {
      state.instance_config.spatial_hierarchy.markers.planning_level_name = planning_level

      // Might not want to do this
      state.instance_config.spatial_hierarchy.markers.record_location_selection_level_name = planning_level
    },




    'set_form': (state, form) => {
      state.form = form
    },
    'set_validations': (state, validations) => {
      state.validations = validations
    },
    'set_aggregations': (state, aggregations) => {
      state.aggregations = aggregations
    },
    
  }
}
