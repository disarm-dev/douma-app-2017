<template>
  <md-list>
    <md-list-item><router-link to="/meta/debug/location">location</router-link></md-list-item>
    <md-list-item><router-link to="/meta/debug/building">building</router-link></md-list-item>
    <md-list-item><router-link to="/meta/debug/validations">validations</router-link></md-list-item>
    <md-list-item><router-link to="/meta/debug/fake_data">fake data</router-link></md-list-item>

    <md-list-item><a @click="check_geolocation()">check geolocation</a></md-list-item>
    <md-list-item><a @click="reset_config()">reset config</a></md-list-item>
    <md-list-item><a @click="log_form_elements">form_elements</a></md-list-item>

    <md-list-item><a href="/3rdpartylicenses.txt">licenses</a></md-list-item>

    <p v-if="geolocation_test_response">{{geolocation_test_response}}</p>

    <router-view></router-view>

  </md-list>
</template>

<script>
  import {elements_array}from 'lib/form_helpers'

  export default {
    name: 'debug',
    data () {
      return {
        geolocation_test_response: ''
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

<style></style>
