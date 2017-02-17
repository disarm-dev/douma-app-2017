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
            <label>Team ID</label>
            <md-input v-model='team_id'></md-input>
          </md-input-container>

          <md-list>
            <md-list-item v-for='user in users' @click.native='fake_login(user)'>
              {{user.name}}
            </md-list-item>
          </md-list>


<!--           <md-input-container>
            <label>Email</label>
            <md-input type="email" v-model.trim="email"></md-input>
          </md-input-container>

          <md-input-container>
            <label>Password</label>
            <md-input type="password" v-model="password"></md-input>
          </md-input-container>

          <p class="md-body-1">
            <a @click.native="$router.push({name: 'meta:resetpassword'})">Forgot your password?</a>
          </p>

          <md-button type="submit" class="md-raised md-primary login-button" :disabled="disabled">Login</md-button>
        </form>
        <hr />
        <div>
          <p class="md-body-1 text-center">Don't have an account?</p>
          <md-button class="login-button md-raised md-accent" @click.native="$router.push({name: 'meta:newuser'})">Sign up</md-button>
        </div>
 -->      </md-card-content>
    </md-card>

  </div>
</template>

<script>
  export default {
    mounted() {
    },
    data() {
      return {
        msg: 'Please login below',
        disabled: false,
        email: '',
        password: '',
        team_id: 'swz-team',
        users: [
          {
            name: 'Sprayer Bob', 
            fake_password: 'malaria',
            email: 'sprayer@bob.com', 
            allowed_apps: {
              read: ['irs_record'], 
              write: ['irs_record']
            }
          },{
            name: 'Manager Bob', 
            fake_password: 'malaria',
            email: 'manager@bob.com', 
            allowed_apps: {
              read: ['irs_monitor', 'irs_plan', 'irs_record', 'irs_tasker'], 
              write: ['irs_monitor', 'irs_plan', 'irs_record', 'irs_tasker']
            }
          }
        ]
      }
    },
    methods: {
      fake_login(user){
        this.msg = "Loading..."
        this.disabled = true
        this.$store.commit('meta:login_user', user)
        this.$store.commit('meta:set_team_id', this.team_id)
        this.$router.push({name: 'meta:profile'})
      },
      login() {
        this.msg = "Loading..."
        this.disabled = true
        this.$store.commit('meta:login_user', user)
        this.continue()
      },
      continue() {
        if (this.$store.state.meta.previousRoute) {
          let {name} = this.$store.state.meta.previousRoute
          this.$router.push({name})  
        } else {
          this.$router.push({name: 'root'})  
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
