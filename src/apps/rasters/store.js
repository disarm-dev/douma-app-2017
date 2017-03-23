
export default {
  state: {
    selected_date: null,
    selected_layer: null,
    layers: [
      {title: 'Temperature', slug: 'LST'},
      {title: 'Precipitation', slug: 'PRECIP'},
      {title: 'Vegetation', slug: 'EVI'},
      {title: 'Wetness', slug: 'NDWI'},

      // the slug for risk is used to change the tile url
      {title: 'Risk', slug: 'RISK'}, 
    ],
  },
  mutations: {
    'rasters:select_date': (state, date) => {
      state.selected_date = date
    },
    'rasters:select_layer': (state, layer) => {
      state.selected_layer = layer
    },
  },
  actions: {
  }
}
