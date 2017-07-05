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
  import {mapGetters} from 'vuex'

  export default {

    name: 'home',
    computed: {
      ...mapGetters({
        decorated_applets: 'meta/decorated_applets'
      }),
      commit_hash() {
        return COMMIT_HASH.substring(0, 6)
      },
      user() {
        return this.$store.state.meta.user
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
