import record from './pages/record.vue'
import review from './pages/review.vue'

export default [
  {
    path: '/irs/record_point',
    component: record,
    name: 'irs_record_point',
    meta: {title: 'IRS Record', icon: 'assignment'},
  },{
    path: '/irs/record_point/review',
    component: review,
    name: 'irs_record_point:review',
    meta: {title: 'IRS Record', icon: 'assignment'}
  }
]
