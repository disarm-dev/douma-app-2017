<template>
  <div v-show="false">
    <button @shortkey="$router.push('/meta')" v-shortkey="['ctrl', 'u']"></button>
    <button @shortkey="$router.push('/meta/debug')" v-shortkey="['ctrl', 'd']"></button>
    <button @shortkey="show_help()" v-shortkey="['ctrl', 'h']"></button>
    <button v-for="(applet, index) in decorated_applets" :key='index' @shortkey="navigate_applet(applet.name)" v-shortkey="['f' + (index + 1)]"></button>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'hotkeys',
    computed: {
      ...mapGetters({
        decorated_applets: 'meta/decorated_applets'
      }),
    },
    methods: {
      navigate_applet(name) {
        this.$router.push({name})
      },
      show_help() {
        this.$store.commit('root:trigger_help_visible')
      }
    }
  }
</script>

<style scoped>

</style>
