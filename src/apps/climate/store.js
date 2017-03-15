
export default {
  state: {
    country_options: [
      {title: 'Zimbabwe', slug:'ZWE', center: '', zoom: ''}, 
      {title: 'Swaziland', slug:'SWZ', center: '', zoom: ''}
    ],
    country: 'ZWE',
    selected_date: null,
    selected_layer: null,
    layers: [
      {title: 'Temperature', slug: 'LST'},
      {title: 'Precipitation', slug: 'PRECIP'},
      {title: 'Vegetation', slug: 'EVI'},
      {title: 'Wetness', slug: 'NDWI'}
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
