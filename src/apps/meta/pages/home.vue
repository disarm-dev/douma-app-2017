<template>
  <div class='profile'>
    <md-card>
      <md-card-content>
        <div>Hi <em>{{user.name}}</em>, you are logged in as <em>{{user.username}}</em>, with access to</div>
        <md-button v-for='app in applets' :key='app' class='md-raised md-accent' @click.native="$router.push({name: app.name})">{{app.title}}</md-button>
      </md-card-content>
    </md-card>

    <p>Version: {{commit_hash}}</p>
  </div>
</template>

<script>
  import generate_applet_routes from '../../../lib/applet_routes.js'

  export default {

    name: 'home',
    computed: {
      applets() {
        return generate_applet_routes({routes: this.$router.options.routes, user: this.$store.state.meta.user, instance_config: this.$store.state.instance_config})
      },
      commit_hash() {
        return COMMIT_HASH.substring(0, 6)
      },
      user() {
        return this.$store.state.meta.user
      }
    },
  }
</script>

<style scoped>
  .profile {
    max-width: 500px;
    margin: 0 auto;
    padding: 1em 0.5em;
  }

  .md-card {
    margin: 1em 0;
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
