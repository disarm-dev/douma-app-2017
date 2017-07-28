export default {
  namespaced: true,
  state: {
    country: '',
    spatial_hierarchies: [],
    planning_level: '',

    
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
    }
  }
}
