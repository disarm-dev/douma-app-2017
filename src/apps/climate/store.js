
export default {
  state: {
    selected_date: null,
    selected_layer: null,
    layers: [
      {title: 'Temperature', slug: 'LST'},
      {title: 'Precipitation', slug: 'PRECIP'},
      {title: 'Wetness', slug: 'EVI'},
      {title: 'Vegetation', slug: 'NDVI'}
    ],
  },
  mutations: {
    'climate:select_date': (state, date) => {
      state.selected_date = date
    },
    'climate:select_layer': (state, layer) => {
      state.selected_layer = layer
    }
  },
  actions: {
  }
}
