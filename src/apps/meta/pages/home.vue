<template>
  <div class='profile'>
    <md-card>
      <md-card-content>
        <div>Hi <em>{{user.name}}</em>, you are logged in as <em>{{user.username}}</em>, with access to</div>

        <md-list>
          <md-list-item v-for='applet in decorated_applets' :key='applet' @click="navigate(applet.name)">
            <md-icon>{{applet.icon}}</md-icon><span class="applet-item">{{applet.title}}</span>
          </md-list-item>
        </md-list>

      </md-card-content>
    </md-card>

    <p>Version: {{commit_hash}}</p>
  </div>
</template>

<script>
  import {decorated_applets} from 'config/applet_stores_and_routes.js'

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

  .applet-item {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

</style>
