<template>
  <div class="logout">  
    <md-card>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Are you sure you want to log out?</div>
        </md-card-header-text>
      </md-card-header>
      <md-card-content v-if="!$store.state.meta.online">
        <p >You are currently offline, if you log out now you will not have access to DOUMA until you get online and log back in again.</p>
      </md-card-content>
      <md-card-actions>
        <md-button @click.native="cancel">Cancel</md-button>
        <md-button class="md-primary md-raised" @click.native="logout">Logout</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
  export default {
    methods: {
      logout() {
        this.$store.commit('meta:login_user', null)
        this.$store.commit('meta:set_demo_instance_id', null)
        this.$router.push({name: 'meta:login'})
      },
      cancel() {
        this.$router.go(-1)
      }
    }
  }
</script>
<style>
  .logout {
    max-width: 500px;
    margin: 1.5em auto;
  }
</style>