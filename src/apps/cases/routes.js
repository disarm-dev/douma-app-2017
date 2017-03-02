import CasesRoot from './root.vue'
import CasesContainer from './cases-container.vue'

const cases = [
  {
    path: '/cases',
    name: 'cases',
    redirect: '/cases/monitor',
    component: CasesContainer,
    meta: {
      title: 'Cases'
    },
    children: [
      {
        path: 'monitor',
        name: 'cases:monitor',
        component: CasesRoot,
        meta: {
          title: 'Monitor'
        }
      },
      {
        path: 'monitor/map',
        name: 'cases:monitor:map',
        component: CasesRoot,
        meta: {
          keepRouteAlive: true,
          title: 'Map'
        }
      }
    ]
  }
]

export default cases