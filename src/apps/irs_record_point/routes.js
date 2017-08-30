import record from './pages/create/create_record.vue'
import list from './pages/view/list_records.vue'
import view_response from './pages/view/show_response.vue'

export default [
  {
    path: '/irs/record_point',
    redirect: '/irs/record_point/list',
    name: 'irs_record_point',
  },{
    path: '/irs/record_point/list',
    component: list,
    name: 'irs_record_point:list'
  },{
    path: '/irs/record_point/new',
    component: record,
    name: 'irs_record_point:new',
  },{
    path: '/irs/record_point/edit/:response_id',
    props: true,
    component: record,
    name: 'irs_record_point:edit',
  },{
    path: '/irs/record_point/view/:response_id',
    props: true,
    component: view_response,
    name: 'irs_record_point:view',
  }
]
