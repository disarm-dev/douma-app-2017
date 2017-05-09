<template>
  <div class='profile'>
    <md-card style="margin: 1em 0;">
      <md-card-content>
        <md-button v-for='app in applets' :key='app' class='md-raised md-accent' @click.native="$router.push(`/${app}`)">{{app}}</md-button>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
export default {

  name: 'home',
  data () {
    return {
    }
  },
  computed: {
    applets() {
      return this.$store.state.meta.user.allowed_apps.write
    }
  }
};
</script>

<style lang="css" scoped>
</style>