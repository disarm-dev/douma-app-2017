<template>
  <div>
    <md-toolbar>
      <span class="md-title">Testing and debug tools</span>
    </md-toolbar>
    <md-list>
      <!--DATA-->
      <md-list-item><router-link to="/meta/debug/fake_data"><md-icon>flight_takeoff</md-icon><span>Create fake data</span></router-link></md-list-item>
      <md-list-item><router-link to="/meta/debug/validations"><md-icon>playlist_add_check</md-icon><span>Edit validations</span></router-link></md-list-item>
      <md-divider class="md-inset"></md-divider>

      <md-toolbar md-theme="white">
        <span class="md-title">Grouped</span>
      </md-toolbar>


      <!-- LOCATION -->
      <md-list-item>
        <md-icon>explore</md-icon>
        <span>Geolocation</span>
        <md-list-expand>
          <md-list-item><router-link to="/meta/debug/building"><md-icon>location_city</md-icon><span>building hunter</span></router-link></md-list-item>
          <md-list-item><router-link to="/meta/debug/location"><md-icon>my_location</md-icon><span>location test</span></router-link></md-list-item>
          <md-list-item @click="check_geolocation()"><md-icon>location_searching</md-icon><span>check geolocation</span><md-icon v-if='geolocation_pass' class="md-primary">check</md-icon></md-list-item>
        </md-list-expand>
      </md-list-item>

      <!--NETWORK-->
      <md-list-item>
        <md-icon>settings_ethernet</md-icon>
        <span>Network</span>
        <md-list-expand>
          <md-list-item @click="check_network"><md-icon>settings_ethernet</md-icon><span>check network</span>
            <md-icon v-if="network_checking" class="md-warn">network_check</md-icon>
            <md-icon v-if='network_pass' class="md-primary">check</md-icon>
          </md-list-item>
          <md-list-item @click="check_if_update_available"> <md-icon>system_update</md-icon><span>check for update</span>
            <md-icon v-if="update_status === 'PASS'" class="md-warn">update</md-icon>
          </md-list-item>
        </md-list-expand>
      </md-list-item>

      <!-- DATA -->
      <md-list-item>
        <md-icon>folder</md-icon>
        <span>Data</span>

        <md-list-expand>
          <md-list-item><router-link :to="{name: 'meta:debug:check_data_status'}"><md-icon>checkbox</md-icon><span>Check data status</span></router-link></md-list-item>
          <md-list-item><router-link :to="{name: 'meta:debug:validate_data'}"><md-icon>playlist_add_check</md-icon><span>Validate data</span></router-link></md-list-item>

        </md-list-expand>
      </md-list-item>

      <!-- CLEARING THINGS-->
      <md-list-item>
        <md-icon>delete</md-icon>
        <span>Clear data</span>

        <md-list-expand>
          <md-list-item @click="clear_geodata"><md-icon>language</md-icon><span>clear geodata</span><md-icon v-if='geodata_cleared' class="md-primary">check</md-icon></md-list-item>
          <md-list-item v-for="applet in applets" :key="applet" @click="clear_applet_storage(applet)">
            <md-icon>delete</md-icon><span>clear storage for {{applet}}</span>
          </md-list-item>
          <md-list-item @click="clear_local_storage"><md-icon class="md-warn">delete_forever</md-icon><span>clear local storage (wipes all records, data, etc)</span></md-list-item>
        </md-list-expand>
      </md-list-item>

    </md-list>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import get from 'lodash.get'

  import {try_reconnect, get_version} from 'lib/remote/remote.standard-handler'
  import cache from 'config/cache.js'
  import {need_to_update} from 'lib/helpers/update'


  export default {
    name: 'debug',
    data() {
      return {
        // Statuses are 'NONE', 'CHECKING', 'PASS', 'FAIL'
        geolocation_pass: false,

        network_checking: false,
        network_pass: false,

        geodata_cleared: false,

        update_status: 'NONE',
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
        this.geodata_cleared = true
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
      },
      check_if_update_available() {
        this.update_status = 'CHECKING'
        need_to_update().then(need_update => {
          if (need_update) {
            this.update_status = 'PASS'
          } else {
            this.update_status = 'NONE'
          }
        })
      }
    }
  }
</script>

<style></style>
