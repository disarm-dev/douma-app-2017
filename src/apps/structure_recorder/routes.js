import form from './pages/form.vue'

export default [
  {
    path: '/structure_recorder',
    redirect: '/structure_recorder/form',
    name: 'structure_recorder'
  },{
    path: '/structure_recorder/form',
    component: form,
    name: 'structure_recorder:form'
  }
]
