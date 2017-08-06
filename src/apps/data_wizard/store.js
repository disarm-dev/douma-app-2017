export default {
  namespaced: true,
  state: {
    // 1st page
    country: '',
    spatial_hierarchies: [],
    planning_level: '',

    form: null,
    validations: []
  },
  mutations: {
    'set_country': (state, country) => {
      state.country = country
    },
    'set_spatial_hierarchies': (state, spatial_hierarchies) => {
      state.spatial_hierarchies = spatial_hierarchies
    },
    'set_planning_level': (state, planning_level) => {
      state.planning_level = planning_level
    },
    'set_form': (state, form) => {
      state.form = form
    },
    'set_validations': (state, validations) => {
      state.validations = validations
    },
    'set_aggregations': (state, aggregations) => {
      state.aggregations = aggregations
    }
  }
}
