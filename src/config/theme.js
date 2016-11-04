import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

export default function () {
  Vue.use(VueMaterial)

  Vue.material.theme.register('default', {
    primary: 'green',
    accent: 'amber'
  })
}

