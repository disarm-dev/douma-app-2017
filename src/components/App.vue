<template>
  <div id="app">
    <md-toolbar>
      <md-button class="md-icon-button" @click="toggleSideNav">
        <md-icon>menu</md-icon>
      </md-button>
      <!-- <h2 class="md-title" style="flex: 1; padding-left: 0.5em;">NMCP Swaziland | DiSARM</h2> -->
      <h2 class="md-title" style="flex: 1">{{$store.state.breadCrumbs}}</h2> 
      <!-- TODO: @feature Need to add breadcrumbs in each app -->
    </md-toolbar>

    <md-sidenav class="md-left" ref="sideNav">
      <md-toolbar class="md-medium">
        <div class="md-toolbar-container">
          <img src="/assets/nmcp.png" style="height: 50px;">

        </div>
        <div v-if="user">
          <p @click="navigate('meta:profile')">Logged in: {{user.email}}</p>
        </div>
        <div v-else>
          <p>Nope, not logged in.</p>
        </div>
      </md-toolbar>

      <md-list>

        <md-list-item @click="navigate('irs')">
          <md-icon>gps_fixed</md-icon><span>IRS Targeting+Tracking</span>
        </md-list-item>
        
        <md-list-item @click="navigate('irs_progress')">
          <md-icon>send</md-icon><span>IRS Progress</span>
        </md-list-item>

        <md-list-item @click="navigate('foci')">
          <md-icon>filter_center_focus</md-icon><span>Foci</span>
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
  export default {
    props: ['theme'],
    data() {
      return {
        showNav: true
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    methods: {
      navigate(name) {
        this.$router.push({name})
        this.$material.setCurrentTheme(name) // TODO: @fix Need to avoid setting themes that don't exist
        this.toggleSideNav()
      },
      toggleSideNav() {
        this.$refs.sideNav.toggle();
      }
    }
  }
</script>

<style scoped>

</style>
