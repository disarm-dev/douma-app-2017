const basic_map = (store) => {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [22.63977015806131, -25.276453102086563],
    zoom: 4
  });

  map.on('error', (e) => {
    store.commit('root:set_snackbar', {message: 'Problem loading basemap'})
  })

  return map
}

export {basic_map}
