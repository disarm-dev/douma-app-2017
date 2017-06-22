<template>
  <div>
    <!-- MAIN PAGE 'TOOLBAR' -->
    <div class="douma-toolbar">

      <md-toolbar class="md-whiteframe-1dp" >
        <md-button class="md-icon-button" @click.native="toggle_sidebar">
          <md-icon>menu</md-icon>
        </md-button>

        <!-- BREADCRUMBS -->
        <h2 class="md-title" style="flex: 1">
          <span v-if="current_applet_header">
            <md-icon>{{current_applet_header.icon}}</md-icon>
            {{current_applet_header.title}}
          </span>
          <span v-else>
            {{instance_name}}
          </span>
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
    <sidebar></sidebar>

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

  import sidebar from 'components/sidebar.vue'
  import help from 'components/help.vue'
  import {decorated_applets} from 'config/applets'

  export default {
    name: 'DOUMA',
    components: {help, sidebar},
    data() {
      return {
        decorated_applets: [],
      }
    },
    computed: {
      ...mapState({
        instance_name: state => state.instance_config.name,
        sw_message: state => state.sw_message,
        snackbar: state => ({ ...state.snackbar, duration: 7000}),
        loading: state => state.loading,
        online: state => state.network_online
      }),
      current_applet_header() {
        const current_applet_name = this.$route.name.split(':')[0]
        const found = this.decorated_applets.find(applet => applet.name === current_applet_name)
        if (found) {
          return found
        } else {
          return false
        }
      }
    },
    watch: {
      '$store.state.snackbar': 'snackbar_open',
      '$store.state.sw_message': 'open_dialog_sw',
      '$store.state.trigger_help_visible_irrelevant_value': 'open_dialog_help',
    },
    methods: {
      toggle_sidebar() {
        this.$store.commit('root:toggle_sidebar')
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
