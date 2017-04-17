import FociApplet from './applet.vue'
import FociView from './pages/foci_register/view.vue'
import InvestigationView from './pages/investigation/view.vue'
import SuggestionPage from './pages/investigation/suggestion.vue'

export default [
  {
    path: '/foci',
    name: 'foci',
    redirect: '/foci/view',
    component: FociApplet,
    meta: {title: 'Foci', icon: 'location_searching'},
    children: [
      {
        path: 'view',
        name: 'foci:view',
        component: FociView,
        meta: {title: 'View'}
      },
       {
        path: 'view/:foci_id',
        name: 'foci:investigation',
        component: InvestigationView,
        props: true,
        meta: {title: 'Map'}
      },{
        path: 'suggestion',
        name: 'foci:suggestion',
        component: SuggestionPage,
        meta: {title: 'Suggestion'}
      },
    ]
  }
]
