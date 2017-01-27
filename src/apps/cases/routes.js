import CasesRoot from './root.vue'
import CasesContainer from './cases-container.vue'

const cases = [
  {
    path: '/cases',
    name: 'cases',
    redirect: '/cases/monitor',
    component: CasesContainer,
    children: [
      {
        path: 'monitor',
        name: 'cases:monitor',
        component: CasesRoot
      },
      {
        path: 'monitor/map',
        name: 'cases:monitor:map',
        component: CasesRoot,
        meta: {
          keepRouteAlive: true
        }
      }
    ]
  }
]

export default cases