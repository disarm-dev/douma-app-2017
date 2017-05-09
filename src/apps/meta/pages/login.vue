<template>
  <div class='login'>

    <md-card>
      <md-card-content>
        <form novalidate @submit.stop.prevent="login">
          <div>
            <md-icon class="login-icon">person</md-icon>
          </div>
          <p class="md-body-1 login-text">Welcome to the DiSARM {{country}}</p>

          <md-input-container>
            <label>Username</label>
            <md-input v-model="user.email" type="text"></md-input>
          </md-input-container>

          <md-input-container>
            <label>Password</label>
            <md-input v-model="user.password" type="password"></md-input>
          </md-input-container>

          <md-button class="md-accent" :disabled='disabled' @click.native="login()">Login</md-button>

          
        </form>
     </md-card-content>
    </md-card>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        msg: 'Please login below',
        disabled: false,
        user: {
          email: '',
          password: ''
        }
      }
    },
    computed: {
      country() {
        return this.$store.state.instance_config.name
      }
    },
    methods: {
      login() {
        this.disabled = true

        this.$store.dispatch('meta/login', this.user).then(() => {
          this.disabled = false
          this.continue()
        })
        .catch(e => {
          this.disabled = false
          console.log(e)
        })

      },
      continue() {
        if (this.$store.state.meta.previousRoute) {
          let {path} = this.$store.state.meta.previousRoute
          this.$router.push(path)  
        } else {
          this.$router.push('/')  
        }
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
