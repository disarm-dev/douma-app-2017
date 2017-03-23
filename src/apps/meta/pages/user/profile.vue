<template>
  <div class='profile'>
    <md-card style="margin: 1em 0;">
      <md-card-content>
        <p class="md-title profile-title">Welcome to DiSARM </p>

        <md-subheader>You can use the following DiSARM applets:</md-subheader>

        <md-button v-for='app in applets' class='md-raised md-accent' @click.native="$router.push(`/${app.name}`)">{{app.title}}</md-button>

        <md-list class="md-double-line">
          <md-list-item>
            <md-icon class="md-primary">person</md-icon>

            <div class="md-list-text-container">
              <span>{{$store.state.meta.user.name}}</span>
              <span>Name</span>
            </div>
          </md-list-item>

          <md-list-item>
            <md-icon class="md-primary">email</md-icon>
            <div class="md-list-text-container">
              <span>{{$store.state.meta.user.email}}</span>
              <span>Email</span>
            </div>
          </md-list-item>

          <md-list-item>
            <md-icon class="md-primary">flag</md-icon>
            <md-input-container>
                <md-select name="country" v-model="country_slug">
                  <md-option v-for='country in country_options' :value="country.slug">{{country.name}}</md-option>
                </md-select>
                <label for="country">Country</label>
              </md-input-container>
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
        country_slug: this.$store.state.meta.country.slug,
        country_options: COUNTRY_OPTIONS
      }
    },
    computed: {
      country() {
        return this.country_options.find(c => c.slug === this.country_slug)
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
    watch: {
      'country_slug': 'set_country'
    },
    methods: {
      set_country() {
        this.$store.commit('meta:set_country', this.country)
      },
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
