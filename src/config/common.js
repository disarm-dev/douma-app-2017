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
    // The order here is irrelevant to sidebar - that is currently fixed by the user auth/permissions sheet,
    // but should set by instance_config.json
    'data_wizard': {title: 'Data wizard', icon: 'event_seat'},
    'structure_recorder': {title: 'Structure Recorder', icon: 'assignment'},
    'irs_record_point': {title: 'IRS Record', icon: 'assignment'},
    'irs_plan': {title: 'IRS Plan', icon: 'assignment_turned_in'},
    'irs_monitor': {title: 'IRS Monitor', icon: 'dashboard'},
    'irs_tasker': {title: 'IRS Tasker', icon: 'group'},
    'debug': {title: 'Debug', icon: 'bug_report'},
    // Meta below is currently ignored in sidebar (statically included), but here for the breadcrumbs
    'meta': {title: 'User', icon: 'person'},
  },
  basemap: {
    // Middle of southern Africa, start point for zooming in
    default: {
      style: 'mapbox://styles/mapbox/streets-v9',
      coords: [22.63977015806131, -25.276453102086563],
      zoom: 4
    },
    map_token: 'pk.eyJ1Ijoibmljb2xhaWRhdmllcyIsImEiOiJjaXlhNWw1NnkwMDJoMndwMXlsaGo5NGJoIn0.T1wTBzV42MZ1O-2dy8SpOw'
  },
  instances: {
    list: ['struc_demo', 'make', 'bwa', 'nam', 'swz', 'zwe', 'mwi-schisto'],
    // TODO: @refac This required_instance_files list is only relevant for the IRS modules.
    required_instance_files: ['instance', 'form', 'location_selection', 'aggregations', 'fake_form', 'validations', 'presenters', 'decorators']
  },
  remote: {
    max_records_batch_size: 100
  }
}
