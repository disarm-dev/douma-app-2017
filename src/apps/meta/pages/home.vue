<template>
  <div class='profile'>
    <md-card style="margin: 1em 0;">
      <md-card-content>
        <md-button v-for='app in applets' :key='app' class='md-raised md-accent' @click.native="$router.push({name: app.name})">{{app.title}}</md-button>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import generate_applet_routes from '../../../lib/applet_routes.js'
  
  export default {

    name: 'home',
    data () {
      return {
      }
    },
    computed: {
      applets() {
        return generate_applet_routes(this.$router.options.routes, this.$store.state.meta.user)
      }
    }
  }
</script>

<style scoped>
  .profile {
    max-width: 500px;
    margin: 0 auto;
    padding: 1em 0.5em;
  }

  .profile-title {
    padding: 8px 16px;
  }

  .profile-text {
    padding-left: 16px;
  }

  .debug-info {
    color: rgba(0,0,0,.54);
  }

</style>