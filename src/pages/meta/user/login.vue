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
          
          <md-button type="submit" class="md-raised md-primary login-button" :disabled="disabled">Login</md-button>
        </form>
      </md-card-content>
    </md-card>
    
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
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
        console.log('done logging in')
        console.log(firebase.auth().currentUser)
        this.$store.state.user = firebase.auth().currentUser
        this.$router.push({name: 'root'})
      }).catch((e) => {
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
</style>