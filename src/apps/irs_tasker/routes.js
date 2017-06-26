import tasker_list from './pages/tasker_list.vue'
import add_team from './pages/add_team.vue'
import assign_teams from './pages/assign_teams.vue'

export default [
  {
    path: '/irs/tasker',
    component: tasker_list,
    name: 'irs_tasker'
  },
  {
    path: '/irs/tasker/new',
    component: add_team,
    name: 'irs_tasker:add_team',
    props: true
  },
  {
    path: '/irs/tasker/assign',
    component: assign_teams,
    name: 'irs_tasker:assign_teams'
  }
]
