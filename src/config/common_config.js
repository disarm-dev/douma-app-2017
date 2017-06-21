export default {
  api: {
    // Standard DOUMA API
    url: "https://douma-api.herokuapp.com",
    version: "v3",

    // Currently not used
    WEATHER_API_URL: "https://weather.api.disarm.io/processor/output",
    R_SERVER_URL: "https://cluster.api.disarm.io"
  },
  basemap: {
    // Middle of southern Africa, start point for zooming in
    default: {
      style: 'mapbox://styles/mapbox/basic-v9',
      coords: [22.63977015806131, -25.276453102086563],
      zoom: 4
    }
  }
}
