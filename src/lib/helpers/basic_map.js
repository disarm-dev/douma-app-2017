import mapboxgl from 'mapbox-gl'
import CONFIG from 'config/common'

const basic_map = (store) => {
  const map = new mapboxgl.Map({
    container: 'map',
    style: CONFIG.basemap.default.style,
    center: CONFIG.basemap.default.coords,
    zoom: CONFIG.basemap.default.zoom
  });

  map.on('error', (e) => {
    console.warn('🗺 Basic map error:', e)
    store.commit('root:set_snackbar', {message: 'Problem with map data'})
  })

  map.addControl(new mapboxgl.NavigationControl())

  return map
}

export {basic_map}
