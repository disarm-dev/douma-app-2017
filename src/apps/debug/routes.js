import debug from './pages/debug.vue'
import location from './pages/location_debug.vue'
import building from './pages/building_debug.vue'
import validations from './pages/validations_debug.vue'
import fake_data from './pages/fake_data_debug.vue'
import check_data_status from './pages/check_data_status.vue'
import validate_data from './pages/validate_data.vue'
import upload_geodata from './pages/upload_geodata.vue'
import instance_config_view from './pages/instance_config_view.vue'

export default [
  {
    path: '/debug',
    component: debug,
    name: 'debug'
  }, {
    path: '/debug/location',
    component: location,
    name: 'debug:location'
  }, {
    path: '/debug/building',
    component: building,
    name: 'debug:building'
  }, {
    path: '/debug/validations',
    component: validations,
    name: 'debug:validations'
  }, {
    path: '/debug/fake_data',
    component: fake_data,
    name: 'debug:fake_data'
  }, {
    path: '/debug/check_data_status',
    component: check_data_status,
    name: 'debug:check_data_status'
  }, {
    path: '/debug/validate_data',
    component: validate_data,
    name: 'debug:validate_data'
  }, {
    path: '/debug/upload_geodata',
    component: upload_geodata,
    name: 'debug:upload_geodata'
  }, {
    path: '/debug/instance_config_view',
    component: instance_config_view,
    name: 'debug:instance_config_view'
  }
]