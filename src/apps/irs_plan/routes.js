import review from './pages/review.vue'
import edit from './pages/edit.vue'

export default [
  {
    path: '/irs/plan',
    component: review,
    name: 'irs_plan:review',
    meta: {title: 'IRS Plan', icon: 'assignment_turned_in'},
  },
  {
    path: '/irs/plan/edit',
    component: edit,
    name: 'irs_plan:edit',
    meta: {title: 'IRS Plan', icon: 'assignment_turned_in'},
  }
]
