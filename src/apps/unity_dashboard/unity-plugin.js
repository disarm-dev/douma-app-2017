import unity from './unity-integration'

export default UnityPlugin = {
  install(Vue, options) {
    Vue.prototype.$unity = unity
  }
}
