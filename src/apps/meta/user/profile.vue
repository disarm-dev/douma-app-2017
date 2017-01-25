<template>
  <div class='profile'>

    <md-card>
      <md-card-content>
        <md-subheader>Name</md-subheader>
        <p class="profile-text">{{user.name}}</p>
        <md-subheader>Email</md-subheader>
        <p class="profile-text">{{user.email}}</p>

        <md-button class="md-raised md-accent" @click="logout">Logout</md-button>
        <md-button class="md-raised" @click="resetPassword">Reset password</md-button>
      </md-card-content>
    </md-card>

    <md-card>
      <md-card-content>
        <md-subheader>You can use the following pieces/apps:</md-subheader>
        <md-button v-for='app in allowedApps' class='md-raised md-primary' @click="$router.push(app)">{{app}}</md-button>
      </md-card-content>
    </md-card>

</template>

<script>
  export default {
    mounted() {
    },
    data() {
      return {
        allowedApps: ['irs', 'foci']
      }
    },
    computed: {
      user(){
        return this.$store.state.user
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
    margin: 1em auto;
    padding: 0 0.5em;
  }

  .profile-text {
    padding-left: 16px;
  }

</style>
