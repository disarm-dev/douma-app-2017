import FociContainer from './Foci.vue'
// Monitor
import MonitorList from './monitor/list.vue'
import MonitorMap from './monitor/map.vue'
// Identify
import IdentifyMapGuessFoci from './identify/map_guess_foci.vue'
// Investigate
import InvestigateDetail from './investigate/detail.vue'
import InvestigateForm from './investigate/form.vue'
import InvestigateMap from './investigate/map.vue'
// Classify
import ClassifyForm from './classify/form.vue'
// Respond
import RespondForm from './respond/form.vue'

const foci = [
    {
      path: '/foci',
      name: 'foci',
      redirect: '/foci/monitor',
      component: FociContainer,
      meta: {
        title: 'Foci'
      },
      children: [
        {
          path: 'monitor',
          name: 'foci:monitor',
          redirect: 'monitor/list',
          meta: {
            title: 'Monitor'
          }
        },
        {
          path: 'monitor/list',
          name: 'foci:monitor:list',
          component: MonitorList,
          meta: {
            title: 'Monitor'
          }
        },
        {
          path: 'monitor/map',
          name: 'foci:monitor:map',
          component: MonitorMap,
          meta: {
            keepRouteAlive: true,
            title: 'Map'
          }
        },

        {
          path: 'identify',
          name: 'foci:identify',
          component: IdentifyMapGuessFoci,
          meta: {
            keepRouteAlive: true,
            title: 'Identify'
          }
        },

        {
          path: 'investigate',
          name: 'foci:investigate',
          redirect: 'investigate/detail',
          meta: {
            title: 'Detail'
          }
        },
        {
          path: 'investigate/detail',
          name: 'foci:investigate:detail',
          component: InvestigateDetail,
          meta: {
            title: 'Detail'
          }
        },
        {
          path: 'investigate/form',
          name: 'foci:investigate:form',
          component: InvestigateForm,
          meta: {
            title: 'Form'
          }
        },
        {
          path: 'investigate/map',
          name: 'foci:investigate:map',
          component: InvestigateMap,
          meta: {
            title: 'Map'
          }
        },

        {
          path: 'classify/form',
          name: 'foci:classify',
          component: ClassifyForm,
          meta: {
            title: 'Form'
          }
        },

        {
          path: 'respond',
          name: 'foci:respond',
          component: RespondForm,
          meta: {
            title: 'Form'
          }
        }
      ]
    }
  ]

export default foci