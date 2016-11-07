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
        <p>DiSARM Universal Mobile Application</p>
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
import Tabs from './Tabs.vue';
import { mapActions } from 'vuex'

export default {
  components: {
    'duma-tabs': Tabs
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
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
    this.$store.dispatch('increase');
    this.$store.dispatch('increase');
    this.$store.dispatch('increase');
  }
}
</script>

<style scoped>


</style>
