export default {
  api: {
    // Standard DOUMA API
    url: BRANCH === 'master' ? "https://douma-api.herokuapp.com" : "https://douma-api-stage.herokuapp.com",
    version: "v3",

    // Currently not used
    WEATHER_API_URL: "https://weather.api.disarm.io/processor/output",
    R_SERVER_URL: "https://cluster.api.disarm.io"
  },
  applets: {
    // The order here is irrelevant to sidebar - that is set by instance_config.json
    'data_wizard': {title: 'Data wizard', icon: 'event_seat'},
    'irs_record_point': {title: 'IRS Record', icon: 'assignment'},
    'irs_plan': {title: 'IRS Plan', icon: 'assignment_turned_in'},
    'irs_monitor': {title: 'IRS Monitor', icon: 'dashboard'},
    'irs_tasker': {title: 'IRS Tasker', icon: 'group'},
    'meta': {title: 'User', icon: 'person'},
  },
  basemap: {
    // Middle of southern Africa, start point for zooming in
    default: {
      style: 'mapbox://styles/mapbox/streets-v9',
      coords: [22.63977015806131, -25.276453102086563],
      zoom: 4
    }
  },
}
