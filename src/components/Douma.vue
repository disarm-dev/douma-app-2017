<template>
  <div>
    <md-toolbar>
      <md-button class="md-icon-button" @click.native="toggleSideNav">
        <md-icon>menu</md-icon>
      </md-button>
      <!-- <h2 class="md-title" style="flex: 1; padding-left: 0.5em;">NMCP Swaziland | DiSARM</h2> -->
      <h2 class="md-title" style="flex: 1"><bread-crumbs></bread-crumbs></h2> 
      <!-- TODO: @feature Need to add breadcrumbs in each app -->
    </md-toolbar>

    <md-sidenav class="md-left" ref="sideNav">
      <md-toolbar class="md-medium">
        <div class="md-toolbar-container">
          <img src="/assets/nmcp.png" style="height: 50px;">

        </div>
        <div v-if="user">
          <p @click.native="navigate('meta:profile')">Logged in: {{user.email}}</p>
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

        return this.$store.state.user.allowed_apps.read.map((app) => {
          return applet_decorations.find((i) => i.name === app)
        })
      },
      user() {
        return this.$store.state.user
      }
    },
    methods: {
      navigate(name) {
        this.$router.push({name})
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
