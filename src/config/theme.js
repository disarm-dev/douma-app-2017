import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

export default function () {
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
    irs: {
      primary: 'indigo',
      accent: 'pink'
    },
    cases: {
      primary: 'teal',
      accent: 'orange'
    }
  })
}

