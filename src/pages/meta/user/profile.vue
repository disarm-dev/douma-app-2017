<template>
  <div class='profile'>

    <md-card>
      <md-card-content>
        <md-subheader>Name</md-subheader>
        <p class="profile-text">{{name}}</p>
        <md-subheader>Email</md-subheader>
        <p class="profile-text">{{email}}</p>

        <md-button class="md-raised md-accent" @click="logout">Logout</md-button>
      </md-card-content>
    </md-card>

  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  mounted() {
    const user = firebase.auth().currentUser
    this.email = user.email
    this.name = user.displayName
  },
  data() {
    return {
      name: '',
      email: '',
    }
  },
  methods: {
    logout() {
      this.$router.push({name: 'meta:logout'})
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
