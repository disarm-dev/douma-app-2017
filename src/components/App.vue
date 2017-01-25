<template>
  <div id="app" v-md-theme="(theme ? theme : 'default')">
    <md-toolbar>
      <md-button class="md-icon-button" @click="toggleSideNav">
        <md-icon>menu</md-icon>
      </md-button>
      <img src="/assets/nmcp.png" style="height: 50px;">
      <!-- <h2 class="md-title" style="flex: 1; padding-left: 0.5em;">NMCP Swaziland | DiSARM</h2> -->
      <h2 class="md-title" style="flex: 1">DOUMA > {insert breadcrumbs}</h2>
    </md-toolbar>

    <md-sidenav class="md-left" ref="sideNav">
      <md-toolbar class="md-medium">
        <div class="md-toolbar-container">
          <h3 class="md-title">DOUMA</h3>
        </div>
        <div v-if="user">
          <p>Logged in: {{user.email}}</p>
        </div>
      </md-toolbar>

      <md-list>
        <md-list-item @click="navigate('foci')">
          <md-icon>filter_center_focus</md-icon><span>Foci</span>
        </md-list-item>

        <md-list-item @click="navigate('irs')">
          <md-icon>send</md-icon><span>IRS Progress</span>
        </md-list-item>

        <md-list-item @click="navigate('cases')">
          <md-icon>featured_play_list</md-icon><span>Cases</span>
        </md-list-item>

        <md-list-item @click="navigate('gps')">
          <md-icon>gps_fixed</md-icon><span>GPS</span>
        </md-list-item>

        <md-divider class="md-inset"></md-divider>

        <md-list-item @click="navigate('meta:profile')">
          <md-icon>person</md-icon><span>Meta</span>
        </md-list-item>

      </md-list>
    </md-sidenav>    

    <div>
      <router-view ></router-view>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import Tabs from './Tabs.vue'


export default {
  props: {
    theme: String
  },
  components: {
    'douma-tabs': Tabs
  },
  data() {
    return {
      app: {},
      user: {},
      showNav: true
    }
  },
  methods: {
    navigate(name) {
      this.showNav = false // we need this to re-render the tabs for the new routes
      setTimeout(() => this.showNav = true, 10)
      this.$router.push({name})
      this.toggleSideNav()
    },
    toggleSideNav() {
      this.$refs.sideNav.toggle();
    }
  },
  created() {

    // if (navigator.onLine){
    //   // TODO: Want to move this firebase init stuff somewhere else?
    //   this.app = firebase.initializeApp({
    //     apiKey: "AIzaSyDsZiVbY7Dit61RgEQtXDeHHplC77h3URc",
    //     authDomain: "disarm-platform.firebaseapp.com",
    //     databaseURL: "https://disarm-platform.firebaseio.com",
    //     storageBucket: "disarm-platform.appspot.com",
    //     messagingSenderId: "11635888704"
    //   });

    //   firebase.auth().signInWithEmailAndPassword('user@disarm.io', 'screwMalaria123').then(() => {
    //     this.user = firebase.auth().currentUser

    //   }).catch((e) => {
    //     console.error(e);
    //   })
    // } else {
    //   console.warn('Browser is offline - not trying to authenticate the user')
    // }
  }
}
</script>

<style scoped>

</style>
