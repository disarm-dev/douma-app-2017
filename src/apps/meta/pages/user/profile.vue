<template>
  <div class='profile'>
    <md-card style="margin: 1em 0;">
      <md-card-content>
        <md-subheader>Welcome to DiSARM </md-subheader>

        

        <p>Some content here</p>
      </md-card-content>
      <md-card-content>
        <md-subheader>You can use the following pieces/apps:</md-subheader>
        <md-button v-for='app in $store.state.meta.user.allowed_apps.read' class='md-raised md-primary' @click.native="$router.push(`/${app}`)">{{app}}</md-button>
      </md-card-content>

      <md-card-content>
        <md-subheader>Clear the IRS databases</md-subheader>
        <md-button class='md-warn md-raised' @click.native='$store.dispatch("irs_record:clear_local_dbs")'>Clear</md-button>
      </md-card-content>
    </md-card>

    <md-card>
      <md-card-content>
        <md-subheader>DOUMA Team ID</md-subheader>
        <p class="profile-text">{{$store.state.meta.demo_instance_id}}</p>
        <md-subheader>Name</md-subheader>
        <p class="profile-text">{{$store.state.meta.user.name}}</p>
        <md-subheader>Email</md-subheader>
        <p class="profile-text">{{$store.state.meta.user.email}}</p>

        <md-button class="md-raised md-accent" @click.native="logout">Logout</md-button>
        <md-button class="md-raised" @click.native="resetPassword">Reset password</md-button>
      </md-card-content>
    </md-card>

    <p class="version">version: {{ version .substring(0,6)}}</p>

</template>

<script>
  export default {
    name: 'ProfileView',
    data() {
      return {
        version: COMMIT_HASH
      }
    },
    methods: {
      logout() {
        this.$router.push({name: 'meta:logout'})
      },
      resetPassword() {
        this.$router.push({name: 'meta:resetpassword'})
      }
    }
  }
</script>

<style>
  .profile {
    max-width: 500px;
    margin: 0 auto;
    padding: 1em 0.5em;
  }

  .profile-text {
    padding-left: 16px;
  }

  .version {
    color: rgba(0,0,0,.54);
  }

</style>
