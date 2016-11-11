<template>

  <div>
    <no-active-foci v-if='!activeFoci' />

    <div v-else>
        <md-button class='md-raised md-accent' @click="$router.push({name: 'foci:investigate:form'})">Form</md-button>
        <md-button class='md-raised md-accent' @click="$router.push({name: 'foci:investigate:map'})">Map</md-button>
        <h2>Foci #{{activeFoci.properties.id}}</h2>
        <ul>
          <li>Classification: {{activeFoci.properties.classification}}</li>
          <li>Responses: {{activeFoci.properties.responses.join(', ')}}</li>
        </ul>
  
      </div>
    </div>
  </template>

<script>
  import NoActiveFoci from '../../../components/no-active-foci.vue'

  export default {
    components: {
      'no-active-foci': NoActiveFoci
    },
    data() {
      return {
        activeFoci: this.$store.state.activeFoci
      }
    },
    mounted() {

    },
    computed: {
    },
    methods: {
    }
  }
</script>

<style>
</style>