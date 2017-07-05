<template>
  <md-stepper md-vertical class="container" @change='change' @completed="completed">
    <md-step v-for='step in steps' :key='step' :md-label="step" :md-message="step">
      <p>{{step}}</p>
    </md-step>
  </md-stepper>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex'

  export default {
    name: 'wizard',
    mounted() {
    },
    data() {
      return {
        steps: ['enumeration', 'risk', 'population', 'planning_level', 'admin_levels']
      }
    },
    methods: {
      change(step) {
        console.log('changed to step ', step)
      },
      completed() {
        console.log('completed')
      }
    }
  }
</script>

<style scoped>

</style>
