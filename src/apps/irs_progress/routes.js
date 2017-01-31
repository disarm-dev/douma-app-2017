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
    meta: {
      title: 'IRS Progress'
    },
    component: IRSContainer,
    redirect: '/irs/tasks',
    children: [
      {
        path: 'tasks',
        name: 'irs:tasks',
        component: IRSTasks,
        meta: {
          title: 'Tasks'
        }
      },
      {
        path: 'map',
        name: 'irs:map',
        component: IRSMap,
        meta: {
          title: 'Map',
          keepRouteAlive: true
        }
      },
      {
        path: 'list',
        name: 'irs:list',
        component: IRSList,
        meta: {
          title: 'List'
        }
      },
      {
        path: 'form',
        name: 'irs:form',
        component: IRSForm,
        meta: {
          title: 'Form'
        }
      },
      {
        path: 'sync',
        name: 'irs:sync',
        component: IRSSync,
        meta: {
          title: 'Sync'
        }
      }
    ]
  }
]

export default irs