
export default {
  state: {
    country_options: [
      {title: 'Zimbabwe', slug:'ZWE', center: {lat: -18.656654486540006, lng: 29.575195312500004}, zoom: 6}, 
      {title: 'Swaziland', slug:'SWZ', center: {lat: -26.502530898533244, lng: 31.528015136718754}, zoom: 8}
    ],
    country: null,
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
    'climate:select_date': (state, date) => {
      state.selected_date = date
    },
    'climate:select_layer': (state, layer) => {
      state.selected_layer = layer
    },
    'climate:select_country': (state, slug) => {
      const country = state.country_options.find((c) => c.slug == slug)
      state.country = country
    }
  },
  actions: {
  }
}
