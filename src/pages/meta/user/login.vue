<template>
  <div class='login'>

    <md-card>
      <md-card-content>
        <form novalidate @submit.stop.prevent="login">
          <div>
            <md-icon class="login-icon">person</md-icon>
            <p class="md-body-1 login-text">{{msg}}</p>
          </div>
          <md-input-container>
            <label>Email</label>
            <md-input type="email" v-model.trim="email"></md-input>
          </md-input-container>

          <md-input-container>
            <label>Password</label>
            <md-input type="password" v-model="password"></md-input>
          </md-input-container>

          <p class="md-body-1">
            <a @click="$router.push({name: 'meta:resetpassword'})">Forgot your password?</a>
          </p>

          <md-button type="submit" class="md-raised md-primary login-button" :disabled="disabled">Login</md-button>
        </form>
        <hr />
        <div>
          <p class="md-body-1 text-center">Don't have an account?</p>
          <md-button class="login-button md-raised md-accent" @click="$router.push({name: 'meta:newuser'})">Sign up</md-button>
        </div>
      </md-card-content>
    </md-card>

  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  mounted() {
    const interval = setInterval(() => {
      if (firebase.auth().currentUser) {
        this.$router.push({name: 'root'})
        clearInterval(interval)
      }
    }, 500)

    setTimeout(() => {
      clearInterval(interval)
    }, 3000)
  },
  data() {
    return {
      msg: 'Please login below',
      disabled: false,
      email: '',
      password: ''
    }
  },
  methods: {
    login() {
      this.msg = "Loading..."
      this.disabled = true

      firebase.auth()
      .signInWithEmailAndPassword(this.email, this.password)
      .then(() => {
        this.$store.state.user = firebase.auth().currentUser
        this.$router.push({name: 'root'})
      }).catch((e) => {
        this.msg = e.message
        this.disabled = false
        console.error(e);
      })
    }
  }
}
</script>

<style>
  .login {
    max-width: 500px;
    margin: 1em auto;
    padding: 0 0.5em;
  }

  .login-icon {
    margin: 0 auto;
    display: block;
    height: 50px;
    width: 50px;
    font-size: 50px;
  }

  .login-text {
    padding-top: 0.5em;
    text-align: center;
  }

  .login-button {
    margin: 0 auto;
    display: block;
  }

  .text-center {
    text-align: center;
  }

</style>
