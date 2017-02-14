<template>
  <div class="reset">
    <md-card>
      <md-card-content>
        <form novalidate @submit.stop.prevent="reset">
          <div>
            <p class="md-body-1 login-text">{{msg}}</p>
          </div>
          <md-input-container v-if='!sentEmail'>
            <label>Email</label>
            <md-input type="email" v-model.trim="email"></md-input>
          </md-input-container>

          <md-button v-if="!sentEmail" :disabled="sentEmail" class="center-button md-primary md-raised" type="submit">Reset password</md-button>
          <md-button v-if="sentEmail" class="center-button md-secondary md-raised" @click.native="back">Go back</md-button>
        </form>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        email: '',
        msg: 'Please enter your email to reset your password.',
        sentEmail: false
      }
    },
    methods: {
      reset() {
        this.sentEmail = true
        this.msg = "An email has been sent with instructions on how to change your password."
      },
      back() {
        this.$router.push({name: 'meta:login'})
      }
    }
  }
</script>
<style>
  .reset {
    max-width: 500px;
    margin: 1em auto;
    padding: 0 0.5em;
  }

  .center-button {
    margin: 0 auto;
    display: block;
  }
</style>