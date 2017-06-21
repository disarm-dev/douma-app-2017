import mapboxgl from 'mapbox-gl'
import config from 'config/common_config'

const basic_map = (store) => {
  const map = new mapboxgl.Map({
    container: 'map',
    style: config.basemap.default.style,
    center: config.basemap.default.coords,
    zoom: config.basemap.default.zoom
  });

  map.on('error', (e) => {
    store.commit('root:set_snackbar', {message: 'Problem loading basemap'})
  })

  return map
}

export {basic_map}
