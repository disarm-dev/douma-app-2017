<template>
  <div class='login'>

    <md-card>
      <md-card-content>
        <form novalidate @submit.stop.prevent="login">
          <div>
            <md-icon class="login-icon">person</md-icon>
          </div>
          <p class="md-body-1 login-text">Welcome to the DiSARM demo.</p>
          <p class="md-body-1">
            For the purpose of the demo, below is an auto-generated Demo Account ID that will give you access to the DiSARM Intervention-Targeting Module.
          </p>
          <p class="md-body-1">
            It is likely that you will want to show others (including the DiSARM Team) what you can do with the software. To do this, you can give those interested the same Demo Account ID that you have, so that they can view the same data you have been using.
          </p>
          <md-input-container>
            <label>Demo instance ID</label>
            <md-input v-model='demo_instance_id'></md-input>
            <md-button @click.native='generate_demo_instance_id'>Generate</md-button>
          </md-input-container>

          <md-list>
            <md-list-item v-for='user in users' :key='user.name'>
              {{user.name}} <md-button :disabled='!can_login' class="md-raised md-primary" @click.native="real_login(user)">Login</md-button>
            </md-list-item>
          </md-list>
        </form>
     </md-card-content>
    </md-card>

  </div>
</template>

<script>
  import {generate_demo_instance_id} from '../../../../lib/demo_instance_id'

  export default {
    data() {
      return {
        msg: 'Please login below',
        disabled: false,
        email: '',
        password: '',
        // TODO: @refac Stop doing all the user stuff in here
        users: [
          {
            name: 'Edgar (Sprayer)', 
            password: 'malaria',
            email: 'a@a.com', 
          },{
            name: 'Philile (Manager)', 
            password: 'malaria',
            email: 'b@b.com', 
            
          },{
            name: 'Brighton (Foci)', 
            password: 'malaria',
            email: 'c@c.com', 
          }
        ]
      }
    },
    computed: {
      demo_instance_id: {
        get(){
          return this.$store.state.meta.demo_instance_id
        },
        set(value){
          // if (value == '') return // Don't set as blank
          // if (value.length < 9) return
          return this.$store.commit("meta:set_demo_instance_id", value)
        }
      },
      can_login(){
        return this.demo_instance_id.length > 5
      }
    },
    methods: {
      fake_login(user){
        this.msg = "Loading..."
        this.disabled = true
        this.$store.commit('meta:login_user', user)
        this.$store.commit('meta:set_demo_instance_id', this.demo_instance_id)
        this.$router.push({name: 'meta:home'})
      },
      real_login(user) {
        this.msg = "Loading..."
        this.disabled = true
        this.$store.commit('meta:set_demo_instance_id', this.demo_instance_id)
        
        this.$store.dispatch('meta:login', user).then(() => {
          this.$router.push({name: 'meta:home'})
        })
        .catch(e => {
          console.log(e)
        })
      },
      login() {
        this.msg = "Loading..."
        this.disabled = true
        this.$store.commit('meta:login_user', user)
        this.continue()
      },
      generate_demo_instance_id() {
        return this.demo_instance_id = generate_demo_instance_id()
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
