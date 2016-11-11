<template>

  <div >
    <no-active-foci v-if='!activeFoci' />

    <div v-else>
        <md-button class='md-raised md-accent' @click="$router.push({name: 'foci:investigate:map'})"
        >Map</md-button>
        <div class='container'>
          <h2>Foci #{{activeFoci.properties.id}}</h2>
          <ul>
            <li>
              <a @click="$router.push({name: 'foci:classify'})">Classification</a>
              : {{activeFoci.properties.classification}}
            </li>
            <li>
              <a @click="$router.push({name: 'foci:respond'})">Responses</a>
              : {{activeFoci.properties.responses.join(', ')}}
            </li>
          </ul>
          <md-button class='md-raised md-accent' @click="$router.push({name: 'foci:investigate:form'})">Edit</md-button>
        </div>
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