import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

export default function () {
  Vue.use(VueMaterial)

  Vue.material.theme.registerAll({
    default: {
      primary: 'green',
      accent: 'amber'
    },
    cyan: {
      primary: 'cyan',
      accent: 'pink'
    },
    indigo: {
      primary: 'indigo',
      accent: 'pink'
    },
    teal: {
      primary: 'teal',
      accent: 'orange'
    }
  })
}

