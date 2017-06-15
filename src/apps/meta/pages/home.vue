<template>
  <div class='profile'>
    <md-card>
      <md-card-content>
        <div>Logged in as: {{user.name}} ({{user.username}})</div>
        <div>Access to:</div>
        <md-button v-for='app in applets' :key='app' class='md-raised md-accent' @click.native="$router.push({name: app.name})">{{app.title}}</md-button>
      </md-card-content>
    </md-card>

    <p v-if="geolocation_test_response">{{geolocation_test_response}}</p>

    <router-link to="/meta/location">location</router-link> |
    <router-link to="/meta/building">building</router-link> |
    <a @click="check_geolocation()">check geolocation</a> |
    <a @click="reset_config()">reset config</a> |
    <a href="/3rdpartylicenses.txt">licenses</a> |
    <a @click="log_form_elements">form_elements</a>
    <router-link to="/meta/validations">validations</router-link>
    <p>{{commit_hash}}</p>
  </div>
</template>

<script>
  import generate_applet_routes from '../../../lib/applet_routes.js'
  import {elements_array}from '../../../lib/form_helpers'

  export default {

    name: 'home',
    data () {
      return {
        geolocation_test_response: ''
      }
    },
    computed: {
      applets() {
        return generate_applet_routes({routes: this.$router.options.routes, user: this.$store.state.meta.user, instance_config: this.$store.state.instance_config})
      },
      commit_hash() {
        return COMMIT_HASH
      },
      user() {
        return this.$store.state.meta.user
      }
    },
    methods: {
      reset_config() {
        this.$store.commit('root:set_instance_config', null)
        this.$store.dispatch('meta/logout').then(() => {
          location.reload()
        })
      },
      check_geolocation() {
        if ('geolocation' in navigator) {
          this.geolocation_test_response = 'Device has geolocation'
        } else {
          this.geolocation_test_response = 'Device has NO geolocation. Will not work for data collection'
        }
      },
      log_form_elements() {
        console.table(elements_array(this.$store.state.instance_config.form))
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
