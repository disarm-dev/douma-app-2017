<template>
  <div>
    <div class="douma-toolbar">
      <template v-cloak>
        <md-progress v-if='loading' class='md-accent' md-indeterminate></md-progress>
      </template>
      
      <md-toolbar class="md-whiteframe-1dp" >
        <md-button class="md-icon-button" @click.native="toggleSideNav">
          <md-icon>menu</md-icon>
        </md-button>
        <!-- <h2 class="md-title" style="flex: 1; padding-left: 0.5em;">NMCP Swaziland | DiSARM</h2> -->
        <h2 class="md-title" style="flex: 1"><bread-crumbs></bread-crumbs></h2> 
        <!-- TODO: @feature Need to add breadcrumbs in each app -->
      </md-toolbar>
    </div>

    <md-sidenav class="md-left" ref="sideNav">
      <md-toolbar class="md-medium">
        <div class="md-toolbar-container">
          <img src="/assets/disarm-logo-word-grey.png" style="height: 50px;">

        </div>
        <div v-if="user">
          <p @click="navigate('meta:profile')">Logged in: {{user.email}}</p>
          <p >Demo instance: <i>{{$store.state.meta.demo_instance_id}}</i></p>
        </div>
        <div v-else>
          <p>Nope, not logged in.</p>
        </div>
      </md-toolbar>

      <md-list>
        <md-list-item v-for='applet in applets' @click.native="navigate(applet.name)">
          <md-icon>{{applet.icon}}</md-icon><span>{{applet.title}}</span>
        </md-list-item>

        <md-divider class="md-inset"></md-divider>

        <md-list-item @click.native="navigate('meta:profile')">
          <md-icon>person</md-icon><span>Meta</span>
        </md-list-item>
      </md-list>
    </md-sidenav>

    <!-- TODO: @feature INSERT SNACKBAR HERE -->
    <md-snackbar md-position="top center" ref="snackbar" :md-duration="snackbar.duration">
      <span>{{snackbar.message}}</span>
      <md-button class="md-accent" md-theme="light-blue" @click.native="snackbar_action">Yes?</md-button>
    </md-snackbar>

    <div>
      <!-- Most likely to contain the AppletContainer -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import BreadCrumbs from './breadCrumbs.vue'

  export default {
    name: 'DOUMA',
    components: {
      BreadCrumbs
    },
    props: ['theme'],
    watch: {
      '$store.state.snackbar': 'snackbar_open'
    },
    data() {
      return {
        showNav: true
      }
    },
    computed: {
      applets() {
        // { short: 'foci', icon: 'filter_center_focus', title:' Foci' },
        // { short: 'cases', icon: 'featured_play_list', title:' Cases' },
        // { short: 'gps', icon: 'gps_fixed', title:' GPS' },

        const applet_decorations = this.$router.options.routes.map((route) => {
          return {...route.meta, name: route.name}
        })

        if (!this.$store.state.meta.user) return
        return this.$store.state.meta.user.allowed_apps.read.map((app) => {
          return applet_decorations.find((i) => i.name === app)
        })
      },
      user() {
        return this.$store.state.meta.user
      },
      snackbar() {
        return {
          ...this.$store.state.snackbar, 
          duration: 7000
        }
      },
      loading() {
        return this.$store.state.loading
      }
    },
    methods: {
      navigate(name) {
        this.$router.push({name})
        this.toggleSideNav()
      },
      toggleSideNav() {
        this.$refs.sideNav.toggle();
      },
      snackbar_open() {
        this.$refs.snackbar.open()
      },
      snackbar_action() {
        this.$refs.snackbar.close()
        this.snackbar.action()
      }
    }
  }
</script>

<style>
  body {
    padding-top: 64px;
  }

  .douma-toolbar {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 5;
  }

  [v-cloak] {
    display: none;
  }
</style>
