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
    </md-dialog>


    <!--ServiceWorker message DIALOG -->
    <md-dialog ref="sw_dialog">
      <md-dialog-title>{{sw_message.title}}</md-dialog-title>
      <md-dialog-content>{{sw_message.message}}</md-dialog-content>
      <md-dialog-actions>
        <md-button @click.native="close_sw_dialog">Cancel</md-button>
        <md-button class="md-primary" @click.native="reload">Reload now</md-button>
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
      }),
    },
    watch: {
      'snackbar': 'snackbar_open',
      'sw_message': 'open_sw_dialog',
      'geodata_loading_progress': 'toggle_geodata_loading_dialog',
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
        if (this.geodata_loading_progress === Infinity) return 

        if (this.geodata_ready === 'error') {
          // TODO: @refac Better way to handle geodata loading errors
          this.$store.commit('root:set_geodata_ready', false)
          return this.$refs.geodata_loading_modal.close()
        }

        if (this.$refs.geodata_loading_modal.active && this.geodata_loading_progress === 100) {
          this.$refs.geodata_loading_modal.close()
        } else {
          // Wait to see if geodata can be loaded from cache (will prob be fast)
          setTimeout(() => {
            if (!this.geodata_ready) {
              this.$refs.geodata_loading_modal.open()
            }
          }, 500)
        }
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
