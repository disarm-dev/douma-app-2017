import ContainerComponent from '../../components/container-component.vue'


import Clusterer from './clusterer.vue'

export default [
  {
    path: '/irs_plan',
    name: 'irs_plan',
    component: Clusterer,
    meta: {title: 'IRS Plan', icon: 'gps_fixed'}
  }
]