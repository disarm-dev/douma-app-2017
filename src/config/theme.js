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
    irs_record: {
      primary: 'indigo',
      accent: 'pink'
    },
    cases: {
      primary: 'teal',
      accent: 'orange'
    },
    meta: {
      primary: 'pink',
      accent: 'blue'
    }
  })
}

