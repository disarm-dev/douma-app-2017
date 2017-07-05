<template>
  <md-list>
    <md-list-item><router-link to="/meta/debug/building"><md-icon>location_city</md-icon><span>building</span></router-link></md-list-item>
    <md-list-item><router-link to="/meta/debug/validations"><md-icon>playlist_add_check</md-icon><span>validations</span></router-link></md-list-item>
    <md-list-item><router-link to="/meta/debug/fake_data"><md-icon>flight_takeoff</md-icon><span>fake data</span></router-link></md-list-item>
    <md-divider class="md-inset"></md-divider>

    <md-list-item><router-link to="/meta/debug/location"><md-icon>my_location</md-icon><span>location</span></router-link></md-list-item>
    <md-list-item @click="check_geolocation()"><md-icon>location_searching</md-icon><span>check geolocation</span></md-list-item>
    <md-list-item @click="log_form_elements"><md-icon>assignment</md-icon><span>form elements</span></md-list-item>
    <md-list-item href="/3rdpartylicenses.txt"><md-icon>library_books</md-icon><span>licenses</span></md-list-item>
    <md-divider class="md-inset"></md-divider>

    <md-list-item @click="clear_local_storage"><md-icon class="md-warn">delete_forever</md-icon><span>clear local storage</span></md-list-item>


    <router-view></router-view>

  </md-list>
</template>

<script>
  import {elements_array}from 'lib/form_helpers'

  export default {
    name: 'debug',
    methods: {
      check_geolocation() {
        let message
        if ('geolocation' in navigator) {
          message = 'Device has geolocation'
        } else {
          message = 'Device has NO geolocation. Will not work for data collection'
        }
        this.$store.commit('root:set_snackbar', {message})
      },
      log_form_elements() {
        console.table(elements_array(this.$store.state.instance_config.form))
      },
      clear_local_storage() {
        localStorage.clear()
        console.log('Cleared localStorage')
        this.$router.push('/')
        location.reload()
      }
    }
  }
</script>

<style></style>
