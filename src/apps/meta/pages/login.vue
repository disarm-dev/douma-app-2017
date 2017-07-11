<template>
  <div class='login'>

    <md-card>
      <md-card-content>
        <form novalidate @submit.stop.prevent="login()">
          <div>
            <md-icon class="login-icon">person</md-icon>
          </div>
          <p class="md-body-1 login-text">Welcome to {{instance_title}}</p>
          <p class="md-body-1 login-text login-error" v-if="error">{{error}}</p>
          <md-input-container>
            <label>Username</label>
            <md-input ref='username' v-model="user_details.username" required type="email"></md-input>
          </md-input-container>

          <md-input-container>
            <label>Password</label>
            <md-input v-model="user_details.password" required type="password"></md-input>
          </md-input-container>

          <md-button class="md-accent md-raised login-button" :disabled='login_disabled || !can_login' type="submit">Login</md-button>
        </form>

     </md-card-content>
    </md-card>

    <p>
      Version: {{commit_hash}}
      <span
        class='personalised_instance_id'
        @click="open_personalised_instance_id"
      >
        <span v-if="personalised_instance_id !== 'default'">{{personalised_instance_id}}</span>
        <md-icon :class="{'md-warn': personalised_instance_id !== 'default'}">local_laundry_service</md-icon>
      </span>
    </p>


    <md-dialog-prompt
      md-title="Generate or enter a personalised instance ID"
      md-content="Please only change this if you know what you're doing, e.g. for training or testing."
      md-ok-text="OK"
      md-cancel-text="Use default"
      @close="close_personalised_instance_id"
      v-model="custom_personalised_instance_id"
      ref="personalised_instance_id">
    </md-dialog-prompt>

  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import {generate_personalised_instance_id} from 'lib/personalised_instance_id_generator'

  export default {
    data() {
      return {
        error: '',
        login_disabled: false,
        user_details: {
          username: '',
          password: ''
        },
        custom_personalised_instance_id: '',
      }
    },
    computed: {
      ...mapState({
        instance_title: state => state.instance_config.instance.title,
        personalised_instance_id: state => state.meta.personalised_instance_id
      }),
      can_login() {
        return this.user_details.username.length !== 0 && this.user_details.password.length !== 0
      },
      commit_hash() {
        return COMMIT_HASH_SHORT
      },
    },
    mounted() {
      if (this.$store.state.meta.user) {
        this.$router.push('/')
      }
      this.$nextTick(() => {
        this.$refs.username.$el.focus()
      })
    },
    methods: {
      open_personalised_instance_id() {
        this.custom_personalised_instance_id = this.personalised_instance_id === 'default' ? generate_personalised_instance_id() : this.personalised_instance_id
        this.$refs.personalised_instance_id.open()
      },
      close_personalised_instance_id(type) {
        if (type === 'cancel') {
          this.$store.commit('meta/set_personalised_instance_id', null)
          this.custom_personalised_instance_id = ''
        } else {
          this.$store.commit('meta/set_personalised_instance_id', this.custom_personalised_instance_id)
        }
      },
      valid_login_request() {
        if (!this.user_details.username) {
          this.error = "Please enter a username"
          return false
        }

        if (!this.user_details.password) {
          this.error = "Please enter a password"
          return false
        }

        return true
      },
      login() {
        this.$store.commit('root:set_loading', true)
        this.error = ""

        if (!this.valid_login_request()) return

        this.login_disabled = true


        const login_details = {
          username: this.user_details.username,
          password: this.user_details.password,
          personalised_instance_id: this.personalised_instance_id
        }

        this.$store.dispatch('meta/login', login_details).then(() => {
          this.$ga.set("user", `${this.$store.state.meta.user.username}/${this.$store.state.meta.user.name}`)
          this.$store.commit('root:set_loading', false)
          this.login_disabled = false
          this.continue()
        })
        .catch(e => {
          this.$store.commit('root:set_loading', false)
          this.login_disabled = false

          // 401 from server
          if (e.response && e.response.status === 401) {
            return this.error = e.response.data.error
          }

          // Anything with an error property
          if (e.error) {
            return this.error = e.error
          }

          // Some other error, best to log it out and take a look
          console.log(e)
          this.error = 'Sorry, cannot login. Network error. Please retry.'
        })

      },
      continue() {
        if (this.$store.state.meta.previous_route) {
          let path = this.$store.state.meta.previous_route
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

  .personalised_instance_id {
    float: right;
    color: #d4d4d4;
    cursor: pointer;
  }

</style>
