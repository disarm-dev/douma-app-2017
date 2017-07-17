<template>
  <div v-show="false">
    <button @shortkey="$router.push('/meta')" v-shortkey="['ctrl', 'meta', 'u']">user page</button>
    <button @shortkey="$router.push('/meta/debug')" v-shortkey="['ctrl', 'meta', 'e']">debug page</button>
    <button v-for="(applet, index) in decorated_applets" :key='index' @shortkey="navigate_applet(applet.name)" v-shortkey="['f' + (index + 1)]">nav applet {{applet.name}}</button>
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
    }
  }
</script>

<style scoped>

</style>
