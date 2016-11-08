<template>

  

  <div id="app" v-md-theme="'default'">

    <md-toolbar>

      <md-button class="md-icon-button" @click="toggleSideNav">
        <md-icon>menu</md-icon>
      </md-button>

      <h2 class="md-title" style="flex: 1">DiSARM</h2>

    </md-toolbar>

    <md-sidenav class="md-left" ref="sideNav">
      <md-toolbar class="md-medium">
        <div class="md-toolbar-container">
          <h3 class="md-title">DUMA</h3>
        </div>
        <div v-if="user">
          <p>Logged in: {{user.email}}</p>
        </div>
      </md-toolbar>

      <md-list>
        <md-list-item @click="navigate('foci')">
          <md-icon>move_to_inbox</md-icon><span>Foci</span>
        </md-list-item>

        <md-list-item>
          <md-icon>send</md-icon><span>IRS</span>
        </md-list-item>
      </md-list>
    </md-sidenav>

    <duma-tabs :value="$route.name" @change="navigate" />

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import firebase from 'firebase'
import Tabs from './Tabs.vue'


export default {
  components: {
    'duma-tabs': Tabs
  },
  data() {
    return {
      app: {},
      user: {}
    }
  },
  methods: {
    ...mapActions(['increase']),
    navigate(somewhere) {
      this.$router.push({name: somewhere})
    },
    toggleSideNav() {
      this.$refs.sideNav.toggle();
    }
  },
  created() {

    // TODO: Want to move this firebase init stuff somewhere else?
    this.app = firebase.initializeApp({
      apiKey: "AIzaSyDsZiVbY7Dit61RgEQtXDeHHplC77h3URc",
      authDomain: "disarm-platform.firebaseapp.com",
      databaseURL: "https://disarm-platform.firebaseio.com",
      storageBucket: "disarm-platform.appspot.com",
      messagingSenderId: "11635888704"
    });

    firebase.auth().signInWithEmailAndPassword('user@disarm.io', 'screwMalaria123').then(() => {
      console.log('success')
      this.user = firebase.auth().currentUser
      console.log(this.user)

    }).catch((e) => {
      console.log(e);
    })
  }
}
</script>

<style scoped>

</style>
