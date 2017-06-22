<template>
  <div class='profile'>
    <md-card>
      <md-card-content>
        <div>Hi <em>{{user.name}}</em>, you are logged in as <em>{{user.username}}</em>, with access to</div>
        <md-button
          v-for='applet in decorated_applets'
          :key='applet'
          class='md-raised md-accent'
          @click.native="$router.push({name: applet.name})">
          {{applet.title}}
        </md-button>
      </md-card-content>
    </md-card>

    <p>Version: {{commit_hash}}</p>
  </div>
</template>

<script>
  import {decorated_applets} from 'config/applets'

  export default {

    name: 'home',
    data() {
      return {
        decorated_applets: [],
      }
    },
    computed: {
      commit_hash() {
        return COMMIT_HASH.substring(0, 6)
      },
      user() {
        return this.$store.state.meta.user
      }
    },
    mounted() {
      this.decorated_applets = decorated_applets
      this.$ga.event('meta', 'view_home')
    }
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
