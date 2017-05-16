import record from './pages/record.vue'
import list from './pages/list.vue'

export default [
  {
    path: '/irs/record_point',
    component: record,
    name: 'irs_record_point',
    meta: {title: 'IRS Record', icon: 'assignment'},
  },{
    path: '/irs/record_point/list',
    component: list,
    name: 'irs_record_point:list',
    meta: {title: 'IRS Record', icon: 'assignment'}
  },{
    path: '/irs/record_point/edit/:response_id',
    props: true,
    component: record,
    name: 'irs_record_point:edit',
  }
]
