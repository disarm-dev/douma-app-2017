<template>
  <md-card>
    <div>Well done!</div>
    <md-button>Create instance</md-button>

    Visit the new instance here: (login with guest and m)
    <a :href="new_instance_url">{{new_instance_url}}</a>

  </md-card>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex'

  export default {
    name: 'complete',
    mounted() {
    },
    data() {
      return {
        new_instance_url: ''
      }
    },
    methods: {}
  }
</script>

<style scoped>

</style>
