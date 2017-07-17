<template>
  <div class="douma-toolbar">
    <md-toolbar class="md-whiteframe-1dp md-dense">
      <md-button class="md-icon-button" @click.native="toggle_sidebar">
        <md-icon>menu</md-icon>
      </md-button>

      <!-- BREADCRUMBS -->
      <h2 class="md-title" style="flex: 1">
          <!--Display custom applet header if exists -->
          <span v-if="current_applet_header">
            <md-icon>{{current_applet_header.icon}}</md-icon>
            {{current_applet_header.title}}
          </span>

          <span v-else>
            {{instance_title}}
          </span>
      </h2>

      <!-- LOADING SPINNER see also progress bar below -->
      <div>
        <md-spinner v-if="loading" class='spinner' :md-size="20" md-indeterminate>
        </md-spinner>
        <md-tooltip md-direction="left">DiSARM is syncing one of the modules</md-tooltip>
      </div>

      <!-- OFFLINE , TRY RECONNECT-->
      <md-button v-if="!online" @click="try_reconnect" class="md-icon-button md-dense md-warn">
        <md-icon>signal_wifi_off</md-icon>
      </md-button>

      <!--HELP ICON-->
      <md-button class="md-icon-button md-dense" @click.native="toggle_help_visible">
        <md-icon>help</md-icon>
      </md-button>

    </md-toolbar>

    <!-- LOADING BAR  see also spinner above-->
    <md-progress v-if='loading' class='md-accent' md-indeterminate></md-progress>
  </div>

</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import {try_reconnect} from 'lib/remote/remote.standard-handler'

  export default {
    name: 'toolbar',
    mounted() {
    },
    data() {
      return {}
    },
    computed: {
      ...mapState({
        instance_title: state => state.instance_config.instance.title,
        online: state => state.network_online
      }),
      ...mapGetters({
        decorated_applets: 'meta/decorated_applets',
        loading: 'loading/anyLoading'
      }),
      current_applet_header() {
        let current_applet_name
        if (this.$route.name) {
          current_applet_name = this.$route.name.split(':')[0]
        } else {
          console.log('wtf?')
        }

        const found = this.decorated_applets.find(applet => applet.name === current_applet_name)
        if (found) {
          return found
        } else {
          return false
        }
      }
    },
    methods: {
      toggle_sidebar() {
        this.$store.commit('root:toggle_sidebar')
      },
      // Help
      toggle_help_visible() {
        this.$store.commit('root:trigger_help_visible')
      },
      try_reconnect() {
        try_reconnect()
      }
    }
  }
</script>

<style scoped>
  .douma-toolbar {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 5;
  }

  .help_button {
    cursor: pointer;
  }

</style>

<style>
  .spinner svg circle {
    stroke: white !important;
  }

</style>
