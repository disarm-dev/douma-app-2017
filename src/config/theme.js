import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

export default () => {
  Vue.use(VueMaterial)

  Vue.material.registerTheme({
    default: {
      primary: 'green',
      accent: 'amber'
    },
    foci: {
      primary: 'cyan',
      accent: 'pink'
    },
    irs_monitor: {
      primary: 'indigo',
      accent: 'pink'
    },
    irs_plan: {
      primary: 'indigo',
      accent: 'pink'
    },
    irs_record: {
      primary: 'indigo',
      accent: 'pink'
    },
    irs_tasker: {
      primary: 'indigo',
      accent: 'pink'
    },
    cases: {
      primary: 'teal',
      accent: 'orange'
    },
    climate: {
      primary: 'blue',
      accent: 'brown'
    },
    meta: {
      primary: 'pink',
      accent: 'blue'
    }
  })
}

