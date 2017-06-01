<template>
  <div>
    <!-- MAIN PAGE 'TOOLBAR' -->
    <div class="douma-toolbar">
      <!-- LOADING BAR -->
      <template v-cloak>
        <md-progress v-if='loading' class='md-accent' md-indeterminate></md-progress>
      </template>

      <md-toolbar class="md-whiteframe-1dp" >
        <md-button class="md-icon-button" @click.native="toggleSideNav">
          <md-icon>menu</md-icon>
        </md-button>
        <!-- BREADCRUMBS -->
        <h2 class="md-title" style="flex: 1">
          <!-- <bread-crumbs></bread-crumbs> -->
          {{country}}
        </h2>
      </md-toolbar>
    </div>

    <!-- SIDENAV -->
    <md-sidenav class="md-left" ref="sideNav">
      <md-toolbar class="md-medium">
        <div class="md-toolbar-container">
          <h3>Country: {{$store.state.instance_config.name}}</h3>
          <!-- <img src="/assets/disarm-logo-word-grey.png" style="height: 50px;"> -->

        </div>
        <div v-if="user">
          <p @click="navigate('meta:home')">Logged in: {{user.name}}</p>
        </div>
        <div v-else>
          <p>Nope, not logged in.</p>
        </div>
      </md-toolbar>

      <md-list v-if='user'>
        <md-list-item v-for='applet in applets' :key='applet' @click.native="navigate(applet.name)">
          <md-icon>{{applet.icon}}</md-icon><span>{{applet.title}}</span>
        </md-list-item>

        <md-divider class="md-inset"></md-divider>


        <md-list-item @click.native="navigate('meta:home')">
          <md-icon>person</md-icon><span>User</span>
        </md-list-item>

        <md-list-item class='md-accent' @click.native="navigate('meta:logout')">
          <md-icon>exit_to_app</md-icon><span>Logout</span>
        </md-list-item>

      </md-list>
    </md-sidenav>

    <!-- SNACKBAR -->
    <md-snackbar md-position="top center" ref="snackbar" :md-duration="snackbar.duration">
      <span>{{snackbar.message}}</span>
      <md-button class="md-accent" md-theme="light-blue" @click.native="snackbar_action">OK</md-button>
    </md-snackbar>

    <!-- DIALOG -->
    <md-dialog-alert
      :md-title="sw_message.title"
      :md-content="sw_message.message"
      md-ok-text="Ok"
      ref="sw_dialog">
    </md-dialog-alert>


    <!-- APPLET CONTAINER -->
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import BreadCrumbs from './breadCrumbs.vue'
  import generate_applet_routes from '../lib/applet_routes.js'

  export default {
    name: 'DOUMA',
    components: {
      BreadCrumbs
    },
    props: ['theme'],
    watch: {
      '$store.state.snackbar': 'snackbar_open',
      '$store.state.sw_message': 'sw_dialog_open'
    },
    mounted() {
      // if ((typeof this.$store.state.user !== 'undefined') && (this.$store.state.meta.user.version !== COMMIT_HASH)) {
      //   console.log("Version has changed. Need to reload.")
      //   this.$store.commit('meta:login_user', null)
      //   this.$router.push({name: 'meta:login'})
      // }
    },
    data() {
      return {
        showNav: true
      }
    },
    computed: {
      country() {
        return this.$store.state.instance_config.name
      },
      sw_message() {
        return this.$store.state.sw_message
      },
      applets() {
        return generate_applet_routes({routes: this.$router.options.routes, user: this.$store.state.meta.user, instance_config: this.$store.state.instance_config})
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
      sw_dialog_open() {
        this.$refs.sw_dialog.open()
      },
      snackbar_open() {
        this.$refs.snackbar.open()
      },
      snackbar_action() {
        this.$refs.snackbar.close()
      }
    }
  }
</script>

<style>
  body {
    background-color: white;
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
