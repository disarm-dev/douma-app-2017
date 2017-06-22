<template>
  <div>
    <!-- MAIN PAGE 'TOOLBAR' -->
    <toolbar></toolbar>

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
        <md-button class="md-primary" @click.native="close_sw_dialog">Dismiss</md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- HELP -->
    <keep-alive>
      <help></help>
    </keep-alive>


    <!-- APPLET CONTAINER -->
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import toolbar from 'components/toolbar.vue'
  import sidebar from 'components/sidebar.vue'
  import help from 'components/help.vue'
  import {decorated_applets} from 'config/applets'

  export default {
    name: 'DOUMA',
    components: {toolbar, sidebar, help},
    computed: {
      ...mapState({
        sw_message: state => state.sw_message,
        snackbar: state => ({ ...state.snackbar, duration: 7000}),
      })
    },
    watch: {
      '$store.state.snackbar': 'snackbar_open',
      '$store.state.sw_message': 'open_dialog_sw',
    },
    methods: {
      // Dialog
      close_sw_dialog() {
        this.$refs.sw_dialog.close()
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
