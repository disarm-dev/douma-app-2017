<template>
  <div class='login'>

    <md-card>
      <md-card-content>
        <form novalidate @submit.stop.prevent="login()">
          <div>
            <md-icon class="login-icon">person</md-icon>
          </div>
          <p class="md-body-1 login-text">Welcome to DiSARM {{country}}</p>
          <p class="md-body-1 login-text login-error" v-if="error">{{error}}</p>
          <md-input-container>
            <label>Username</label>
            <md-input ref='username' v-model="user.username" required type="email"></md-input>
          </md-input-container>

          <md-input-container>
            <label>Password</label>
            <md-input v-model="user.password" required type="password"></md-input>
          </md-input-container>

          <md-button class="md-accent md-raised login-button" :disabled='disabled || !can_login' type="submit">Login</md-button>
        </form>

        <md-button @click.native="$store.commit('root:trigger_help_visible')">Help</md-button>
     </md-card-content>
    </md-card>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        error: '',
        disabled: false,
        user: {
          username: '',
          password: ''
        }
      }
    },
    computed: {
      country() {
        return this.$store.state.instance_config.name
      },
      can_login() {
        return this.user.username.length !== 0 && this.user.password.length !== 0
      }
    },
    mounted() {
      if (this.$store.state.meta.user) {
        this.$router.push('/')
      }
      this.$refs.username.$el.focus()
    },
    methods: {
      user_is_valid() {
        if (!this.user.username) {
          this.error = "Please enter a username"
          return false
        }

        if (!this.user.password) {
          this.error = "Please enter a password"
          return false
        }

        return true
      },
      login() {
        this.$store.commit('root:set_loading', true)
        this.error = ""

        if (this.user_is_valid()) {

          this.disabled = true

          this.$store.dispatch('meta/login', this.user).then(() => {
            this.$ga.set("user", `${this.$store.state.meta.user.username}/${this.$store.state.meta.user.name}`)
            this.$store.commit('root:set_loading', false)
            this.disabled = false
            this.continue()
          })
          .catch(e => {
            this.$store.commit('root:set_loading', false)
            this.disabled = false

            if (e.response && e.response.status === 401) {
              this.error = e.response.data.error
            } else {
              this.error = 'Network error. Cannot login'
            }
          })
        }

      },
      continue() {
        if (this.$store.state.meta.previousRoute) {
          let path = this.$store.state.meta.previousRoute
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

  .login-error {
    color: red;
  }

  .login-button {
    margin: 0 auto;
    display: block;
  }

  .text-center {
    text-align: center;
  }

</style>
