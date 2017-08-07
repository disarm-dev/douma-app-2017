import wizard from './pages/wizard.vue'

export default [
  {
    path: '/data/wizard',
    name: 'data_wizard',
    redirect: '/data/wizard/1'
  },
  {
    path: '/data/wizard/:step_param',
    props: true,
    component: wizard,
    name: 'data_wizard:step'
  }
]
