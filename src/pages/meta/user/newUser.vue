<template>
  <div class="new-user">
    <md-card>
      <md-card-content>
        <form novalidate @submit.stop.prevent="signup">
          <div>
            <p class="md-body-1 login-text">{{msg}}</p>
          </div>
          <md-input-container>
            <label>Email</label>
            <md-input type="email" v-model.trim="email"></md-input>
          </md-input-container>

          <md-input-container>
            <label>Password</label>
            <md-input type="password" v-model.trim="password"></md-input>
          </md-input-container>

          <md-input-container>
            <label>Confirm password</label>
            <md-input type="password" v-model.trim="confirmPassword"></md-input>
          </md-input-container>

          <md-button class="md-raised center-button" type="submit">Sign up</md-button>
        </form>
      </md-card-content>
    </md-card>
  </div>
</template>
<script>
  import Parse from 'parse'

  export default {
    data () {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        msg: 'Please enter your email and password to sign up.'
      }
    },
    methods: {
      signup() {
        if (this.password !== this.confirmPassword) {
          this.msg = "Passwords do not match"
          return
        }

        Parse.User.signUp(this.email, this.password).then((err) => {
          console.log(err)
          if (err.hasOwnProperty('message')) {
            this.msg = err.message
          } else {
            this.$router.push({name: 'meta:profile'})
          }
        })
      }
    }
  }
</script>
<style>
  .new-user {
    max-width: 500px;
    margin: 1em auto;
    padding: 0 0.5em;
  }

  .center-button {
    margin: 0 auto;
    display: block;
  }
</style>