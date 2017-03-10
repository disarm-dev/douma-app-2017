
export default {
  state: {
    selected_date: null,
    selected_layer: null,
    layers: [
      {title: 'Temperature', slug: 'lst'},
      {title: 'Precipitation', slug: 'precip'},
      {title: 'Wetness', slug: 'ndwi'},
      {title: 'Vegetation', slug: 'ndvi'}
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
