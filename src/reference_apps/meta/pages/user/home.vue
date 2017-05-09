<template>
  <div class='profile'>
    <md-card style="margin: 1em 0;">
      <md-card-content>
        <p class="md-title profile-title">Welcome to DiSARM {{country}}</p>

        <md-subheader>You can use the following DiSARM applets:</md-subheader>

        <md-button v-for='app in applets' :key='app.name' class='md-raised md-accent' @click.native="$router.push(`/${app.name}`)">{{app.title}}</md-button>

        <md-list class="md-double-line">
          <md-list-item>
            <md-icon class="md-primary">person</md-icon>

            <div class="md-list-text-container">
              <span>{{$store.state.meta.user.name}}</span>
              <span>Name</span>
            </div>
          </md-list-item>

        </md-list>

        <md-card-actions>
          <md-button @click.native='logout' class='md-raised md-primary'>
            Logout
          </md-button>
        </md-card-actions>

      </md-card-content>
    </md-card>

    <p class="debug-info">version: {{ version .substring(0,6)}}</p>
    <p class="debug-info">demo instance: {{$store.state.meta.demo_instance_id}}</p>
    <p @click='openDialog()' class='md-dense debug-info'>clear local data</p>
    <p @click='$router.push("/meta/debug")' class='debug-info'>debug</p>

    <md-dialog md-open-from="#clear" md-close-to="#clear" ref="dialog">
      <md-dialog-title>Wipe everything?</md-dialog-title>

      <md-dialog-content>You are about to remove all local data. Are you absolutely sure you wish to proceed?</md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="closeDialog()">Cancel</md-button>
        <md-button class="md-primary" @click.native='clear()'>Clear database</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  export default {
    name: 'ProfileView',
    data() {
      return {
        version: COMMIT_HASH,
      }
    },
    computed: {
      country() {
        return this.$store.state.instance_config.name
      },
      applets() {
        const applet_decorations = this.$router.options.routes.map((route) => {
          return {...route.meta, name: route.name}
        })

        if (!this.$store.state.meta.user) return
        return this.$store.state.meta.user.allowed_apps.read.map((app) => {
          return applet_decorations.find((i) => i.name === app)
        })
      },
    },
    mounted() {
      if (this.$store.state.meta.user.allowed_apps.read.length <= 1) {
        const single_applet = this.$store.state.meta.user.allowed_apps.read[0]
        this.$nextTick(() => this.$router.push({name: single_applet}))
      }
    },
    methods: {
      logout() {
        this.$router.push({name: 'meta:logout'})
      },
      resetPassword() {
        this.$router.push({name: 'meta:resetpassword'})
      },
      clear() {
        this.$store.dispatch("root:wipe_everything").then(() => {
          this.$refs.dialog.close();
          this.$router.push({name: 'meta:login'})
        })
      },
      openDialog(ref) {
        this.$refs.dialog.open();
      },
      closeDialog(ref) {
        this.$refs.dialog.close();
      },
    }
  }
</script>

<style>
  .profile {
    max-width: 500px;
    margin: 0 auto;
    padding: 1em 0.5em;
  }

  .profile-title {
    padding: 8px 16px;
  }

  .profile-text {
    padding-left: 16px;
  }

  .debug-info {
    color: rgba(0,0,0,.54);
  }

</style>
