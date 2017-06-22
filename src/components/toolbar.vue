<template>
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
        <md-icon class='help_button' @click.native="toggle_help_visible">help</md-icon>
      </div>
      <div v-if="!online">
        offline
        <md-icon>settings_ethernet</md-icon>
      </div>
    </md-toolbar>

    <!-- LOADING BAR -->
    <md-progress v-if='loading' class='md-accent' md-indeterminate></md-progress>
  </div>

</template>

<script>
  import {mapState} from 'vuex'
  import {decorated_applets} from 'config/applets'


  export default {
    name: 'toolbar',
    mounted() {
    },
    data() {
      return {}
    },
    computed: {
      ...mapState({
        instance_name: state => state.instance_config.name,
        loading: state => state.loading,
        online: state => state.network_online
      }),
      current_applet_header() {
        const current_applet_name = this.$route.name.split(':')[0]
        const found = decorated_applets.find(applet => applet.name === current_applet_name)
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
</style>
