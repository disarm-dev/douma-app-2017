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
        <h2 class="md-title" style="flex: 1"><bread-crumbs></bread-crumbs></h2> 
      </md-toolbar>
    </div>

    <!-- SIDENAV -->
    <md-sidenav class="md-left" ref="sideNav">
      <md-toolbar class="md-medium">
        <div class="md-toolbar-container">
          <img src="/assets/disarm-logo-word-grey.png" style="height: 50px;">

        </div>
        <div v-if="user">
          <p @click="navigate('meta:profile')">Logged in: {{user.name}}</p>
          <p >Demo instance: <i>{{$store.state.meta.demo_instance_id}}</i></p>
        </div>
        <div v-else>
          <p>Nope, not logged in.</p>
        </div>
      </md-toolbar>

      <md-list v-if='user'>
        <md-list-item v-for='applet in applets' @click.native="navigate(applet.name)">
          <md-icon>{{applet.icon}}</md-icon><span>{{applet.title}}</span>
        </md-list-item>

        <md-divider class="md-inset"></md-divider>

        
        <md-list-item @click.native="navigate('meta:profile')">
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
      <md-button class="md-accent" md-theme="light-blue" @click.native="snackbar_action">Yes?</md-button>
    </md-snackbar>

    <!-- DIALOG -->
    <md-dialog-alert
      :md-title="$store.state.sw_message.title"
      :md-content="$store.state.sw_message.message"
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
      if (this.$store.state.meta.user.version !== COMMIT_HASH) {
        console.log("Version has changed. Need to reload.")        
        this.$store.commit('meta:login_user', null)
        this.$router.push({name: 'meta:login'})
      }
    },
    data() {
      return {
        showNav: true
      }
    },
    computed: {
      applets() {
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
      sw_dialog_open() {
        this.$refs.sw_dialog.open()
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
