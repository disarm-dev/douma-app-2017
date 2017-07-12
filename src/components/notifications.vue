<template>
  <div>
    <!-- SNACKBAR -->
    <md-snackbar md-position="top center" ref="snackbar" :md-duration="snackbar.duration">
      <span>{{snackbar.message}}</span>
      <md-button class="md-accent" @click.native="snackbar_action">OK</md-button>
    </md-snackbar>

    <!-- Geodata loading progress dialog-->
    <md-dialog ref="geodata_loading_modal" :md-click-outside-to-close="false">
      <md-dialog-title>Loading geodata</md-dialog-title>

      <md-dialog-content class="centred">
        <md-spinner class="center-spinner" :md-progress="geodata_loading_progress"></md-spinner>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button :disabled='!geodata_ready' class="md-primary" @click.native="$refs.geodata_loading_modal.close()">OK</md-button>
      </md-dialog-actions>
    </md-dialog>


    <!--ServiceWorker message DIALOG -->
    <md-dialog ref="sw_dialog">
      <md-dialog-title>{{sw_message.title}}</md-dialog-title>

      <md-dialog-content>{{sw_message.message}}</md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="reload">Refresh</md-button>
        <md-button class="md-primary" @click.native="close_sw_dialog">Dismiss</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'notifications',
    computed: {
      ...mapState({
        sw_message: state => state.sw_message,
        snackbar: state => ({ ...state.snackbar, duration: 7000}),
        geodata_loading_progress: state => state.geodata_loading_progress,
        geodata_ready: state => state.geodata_ready
      })
    },
    watch: {
      'snackbar': 'snackbar_open',
      'sw_message': 'open_dialog_sw',
      'geodata_loading_progress': 'toggle_geodata_loading_dialog'
    },
    methods: {
      // Dialog
      open_sw_dialog() {
        this.$refs.sw_dialog.open()
      },
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
      },
      toggle_geodata_loading_dialog() {
        if (this.geodata_ready === 'error') {
          this.$store.commit('root:set_geodata_ready', false)
          this.$refs.geodata_loading_modal.close()
        }

        // Wait 1 second to see if geodata can be loaded from cache
        setTimeout(() => {
          if (!this.geodata_ready) {
            this.$refs.geodata_loading_modal.open()
          }
        }, 1000)
      }
    }
  }
</script>

<style scoped>
  .center-spinner {
    display: block;
    margin: 0 auto;
  }
</style>
