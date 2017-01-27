import IRSContainer from './IRS.vue'
import IRSTasks from './tasks/tasks.vue'
import IRSMap from './map/map.vue'
import IRSList from './list/list.vue'
import IRSForm from './form/form.vue'
import IRSSync from './sync/sync.vue'

const irs = [
  {
    path: '/irs',
    name: 'irs',
    component: IRSContainer,
    redirect: '/irs/tasks',
    children: [
      {
        path: 'tasks',
        name: 'irs:tasks',
        component: IRSTasks
      },
      {
        path: 'map',
        name: 'irs:map',
        component: IRSMap,
        meta: {
          keepRouteAlive: true
        }
      },
      {
        path: 'list',
        name: 'irs:list',
        component: IRSList
      },
      {
        path: 'form',
        name: 'irs:form',
        component: IRSForm
      },
      {
        path: 'sync',
        name: 'irs:sync',
        component: IRSSync
      }
    ]
  }
]

export default irs