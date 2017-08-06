import wizard from './pages/wizard.vue'
import configure_geodata from './pages/configure_geodata.vue'
import create_form from './pages/create_form.vue'
import create_validations from './pages/create_validations.vue'
import create_aggregations from './pages/create_aggregations.vue'
import configure_applets from './pages/configure_applets.vue'
import configure_presenters from './pages/configure_presenters.vue'

export default [
  {
    path: '/data/wizard',
    component: wizard,
    name: 'data_wizard'
  }, {
    path: '/data/wizard/geodata',
    component : configure_geodata,
    name: 'data_wizard:configure_geodata'
  }, {
    path: '/data/wizard/form',
    component : create_form,
    name: 'data_wizard:create_form'
  }, {
    path: '/data/wizard/validations',
    component : create_validations,
    name: 'data_wizard:validations'
  }, {
    path: '/data/wizard/aggregations',
    component : create_aggregations,
    name: 'data_wizard:aggregations'
  }, {
    path: '/data/wizard/applets',
    component : configure_applets,
    name: 'data_wizard:applets'
  }, {
    path: '/data/wizard/presenters',
    component : configure_presenters,
    name: 'data_wizard:presenters'
  }
]
