<template>
  <div>
    <md-toolbar>
      <span class="md-title">Testing and debug tools</span>
    </md-toolbar>
    <md-list>
      <!--DATA-->
      <md-list-item><router-link to="/meta/debug/fake_data"><md-icon>flight_takeoff</md-icon><span>fake data</span></router-link></md-list-item>
      <md-list-item><router-link to="/meta/debug/validations"><md-icon>playlist_add_check</md-icon><span>validations</span></router-link></md-list-item>
      <md-list-item @click="log_form_elements"><md-icon>assignment</md-icon><span>form elements (check devtools log)</span></md-list-item>
      <md-divider class="md-inset"></md-divider>

      <!-- LOCATION -->
      <md-list-item><router-link to="/meta/debug/building"><md-icon>location_city</md-icon><span>building hunter</span></router-link></md-list-item>
      <md-list-item><router-link to="/meta/debug/location"><md-icon>my_location</md-icon><span>location test</span></router-link></md-list-item>
      <md-list-item @click="check_geolocation()"><md-icon>location_searching</md-icon><span>check geolocation</span><md-icon v-if='geolocation_pass' class="md-primary">check</md-icon></md-list-item>
      <md-divider class="md-inset"></md-divider>

      <!-- LEGAL -->
      <md-list-item href="/static/3rdpartylicenses.txt"><md-icon>library_books</md-icon><span>licenses</span></md-list-item>
      <md-divider class="md-inset"></md-divider>

      <!--NETWORK-->
      <md-list-item @click="check_network"><md-icon>settings_ethernet</md-icon><span>check network</span>
        <md-icon v-if='network_pass' class="md-primary">check</md-icon>
        <md-icon v-if="network_checking" class="md-warn">network_check</md-icon>
      </md-list-item>
      <md-divider class="md-inset"></md-divider>

      <!-- CLEARING THINGS-->
      <md-list-item @click="clear_geodata">
        <md-icon>language</md-icon> <span>Clear geodata</span>
      </md-list-item>
      <md-list-item v-for="applet in applets" :key="applet" @click="clear_applet_storage(applet)">
        <md-icon>delete</md-icon><span>clear storage for {{applet}}</span>
      </md-list-item>
      <md-list-item @click="clear_local_storage"><md-icon class="md-warn">delete_forever</md-icon><span>clear local storage (wipes all records, data, etc)</span></md-list-item>

    </md-list>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import get from 'lodash.get'
  import {elements_array}from 'lib/form_helpers'
  import {try_reconnect} from 'lib/data/remote.standard-handler'
  import cache from 'config/cache.js'

  export default {
    name: 'debug',
    data() {
      return {
        geolocation_pass: false,
        network_checking: false,
        network_pass: false
      }
    },
    computed: {
      applets() {return get(this.$store.state.meta, 'user.allowed_apps.read', [])},
    },
    methods: {
      check_geolocation() {
        this.geolocation_pass = false
        if ('geolocation' in navigator) this.geolocation_pass = true
      },
      log_form_elements() {
        console.table(elements_array(this.$store.state.instance_config.form))
      },
      clear_local_storage() {
        localStorage.clear()
        console.log('Cleared localStorage')
        this.$router.push('/')
        location.reload()
      },
      clear_applet_storage(applet) {
        return console.log('applet', applet)
        const mutation  = `${applet}/clear_data_storage`
        this.$store.commit(mutation, {}, {root: true})
      },
      clear_geodata() {
        cache.geodata = {}
      },
      check_network() {
        this.network_pass = false
        this.network_checking = true
        try_reconnect().then(res => {
          this.network_checking = false
          if (res) this.network_pass = true
        }).catch(() => {
          this.network_checking = false
        })
      }
    }
  }
</script>

<style></style>
