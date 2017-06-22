<template>
  <div>
    <!-- MAIN PAGE 'TOOLBAR' -->
    <div class="douma-toolbar">

      <md-toolbar class="md-whiteframe-1dp" >
        <md-button class="md-icon-button" @click.native="toggleSideNav">
          <md-icon>menu</md-icon>
        </md-button>
        <!-- BREADCRUMBS -->
        <h2 class="md-title" style="flex: 1">
          {{country}} <span v-show="page_title"> - <md-icon>{{page_title.icon}}</md-icon> {{page_title.title}}</span>
        </h2>
        <div>
          <md-icon class='help_button' @click.native="$store.commit('root:trigger_help_visible')">help</md-icon>
        </div>
        <div v-if="!online">
          offline
          <md-icon>settings_ethernet</md-icon>
        </div>
      </md-toolbar>

      <!-- LOADING BAR -->
      <md-progress v-if='loading' class='md-accent' md-indeterminate></md-progress>
    </div>

    <!-- SIDENAV -->
    <md-sidenav class="md-left" ref="sideNav">
      <md-toolbar class="md-medium">
        <div class="md-toolbar-container">
          <h3>{{$store.state.instance_config.name}}</h3>
        </div>

        <!--Status/top of sidebar: LOGGED-IN-->
        <div v-if="user">
          <p @click="navigate('meta:home')">Logged in: {{user.name}}</p>
          <p><em>Version {{commit_hash}}</em></p>
        </div>

        <!--Status/top of sidebar: LOGGED-OUT-->
        <div v-else>
          <p>Nope, not logged in.</p>
          <p><em>Version {{commit_hash}}</em></p>
        </div>
      </md-toolbar>

      <!--Sidebar: LOGGED IN-->
      <md-list v-if="user">
        <md-list-item v-for='applet in applets' :key='applet' @click.native="navigate(applet.name)">
          <md-icon>{{applet.meta.icon}}</md-icon><span>{{applet.meta.title}}</span>
        </md-list-item>

        <md-divider class="md-inset"></md-divider>

        <md-list-item @click.native="navigate('meta:home')">
          <md-icon>person</md-icon><span>User</span>
        </md-list-item>

        <md-list-item class='md-primary' @click.native="open_dialog_help">
          <md-icon>help</md-icon><span>Help</span>
        </md-list-item>

        <md-list-item class='md-accent' @click.native="navigate('meta:logout')">
          <md-icon>exit_to_app</md-icon><span>Logout</span>
        </md-list-item>
      </md-list>

      <!--Sidebar: LOGGED OUT-->
      <md-list v-else>
        <md-list-item class='md-primary' @click.native="open_dialog_help">
          <md-icon>help</md-icon><span>Help</span>
        </md-list-item>

        <md-list-item class='md-accent' @click.native="navigate('meta:login')">
          <md-icon>exit_to_app</md-icon><span>Login</span>
        </md-list-item>
      </md-list>

    </md-sidenav>

    <!-- SNACKBAR -->
    <md-snackbar md-position="top center" ref="snackbar" :md-duration="snackbar.duration">
      <span>{{snackbar.message}}</span>
      <md-button class="md-accent" @click.native="snackbar_action">OK</md-button>
    </md-snackbar>

    <!--ServiceWorker message DIALOG -->
    <md-dialog ref="sw_dialog">
      <md-dialog-title>{{sw_message.title}}</md-dialog-title>

      <md-dialog-content>{{sw_message.message}}</md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="reload">Refresh</md-button>
        <md-button class="md-primary" @click.native="close_dialog('sw_dialog')">Dismiss</md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- HELP -->
    <keep-alive>
      <md-dialog ref="help" class="help">
        <md-dialog-title>Help</md-dialog-title>

        <md-dialog-content>
          <help></help>
        </md-dialog-content>

        <md-dialog-actions>
          <md-button class="md-primary" @click.native="close_dialog_help">Close</md-button>
        </md-dialog-actions>
      </md-dialog>
    </keep-alive>


    <!-- APPLET CONTAINER -->
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import generate_applet_routes from 'lib/applet_routes.js'
  import help from 'components/help.vue'

  export default {
    name: 'DOUMA',
    components: {help},
    watch: {
      '$store.state.snackbar': 'snackbar_open',
      '$store.state.sw_message': 'open_dialog_sw',
      '$store.state.trigger_help_visible_irrelevant_value': 'open_dialog_help'
    },
    computed: {
      ...mapState({
        country: state => state.instance_config.name,
        page_title: state =>  {
            return state.applet_header
          // if (state.applet_header.title.length && state.applet_header.icon.length) {
          // }
          // return false
        },
        sw_message: state => state.sw_message,
        user: state => state.meta.user,
        snackbar: state => ({ ...state.snackbar, duration: 7000}),
        loading: state => state.loading,
        online: state => state.network_online
      }),
      applets(){ 
        return generate_applet_routes({routes: this.$router.options.routes, user: this.$store.state.meta.user, instance_config: this.$store.state.instance_config})
      },
      commit_hash() {
        return COMMIT_HASH.substring(0, 6)
      },
    },
    methods: {
      navigate(name) {
        this.$router.push({name})
        this.toggleSideNav()
      },
      toggleSideNav() {
        this.$refs.sideNav.toggle();
      },
      // Dialog
      close_dialog(ref) {
        this.$refs[ref].close()
      },
      // Help
      open_dialog_help() {
        this.$ga.event('meta', 'open_help')
        this.$refs.help.open()
      },
      close_dialog_help() {
        this.$refs.help.close()
      },
      // Snackbar
      snackbar_open() {
        this.$refs.snackbar.open()
      },
      snackbar_action() {
        this.$refs.snackbar.close()
      },
      // Reload page
      reload() {
        location.reload()
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

  .help_button {
    cursor: pointer;
  }

  .help > .md-dialog {
    min-width: 90%;
    height: 90%;
  }
</style>
