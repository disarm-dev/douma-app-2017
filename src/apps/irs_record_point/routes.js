import record from './pages/record.vue'
import list from './pages/list.vue'

export default [
  {
    path: '/irs/record_point',
    redirect: '/irs/record_point/list',
    name: 'irs_record_point',
    meta: {title: 'IRS Record', icon: 'assignment'}
  },{
    path: '/irs/record_point/list',
    component: list,
    name: 'irs_record_point:list',
    meta: {title: 'IRS Record', icon: 'assignment'}
  },{
    path: '/irs/record_point/new',
    component: record,
    name: 'irs_record_point:new',
  },{
    path: '/irs/record_point/edit/:record_id',
    props: true,
    component: record,
    name: 'irs_record_point:edit',
  }
]
