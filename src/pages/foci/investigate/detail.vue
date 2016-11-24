<template>
  <div class='fab-container'>
    <no-active-foci v-if='!activeFoci' />

    <div v-else>
      <md-button class="md-fab md-clean" @click="$router.push({name: 'foci:investigate:map'})">
        <md-icon>location_on</md-icon>
      </md-button>
      <div class="foci-detail">    
        <h2>Foci #{{activeFoci.properties.id}}</h2>
        <ul>
          <li>
            <a @click="$router.push({name: 'foci:classify'})">Classification</a>
            : {{activeFoci.properties.classification}}
          </li>
          <li>
            <a @click="$router.push({name: 'foci:respond'})">Responses</a>
            : {{activeFoci.properties.responses.filter(r => r.value).map(r => r.name).join(', ')}}
          </li>
        </ul>
        <md-button class='md-raised md-accent' @click="$router.push({name: 'foci:investigate:form'})">Survey</md-button>
        <md-button class='md-raised md-accent' @click="$router.push({name: 'foci:investigate:map'})">Add driver of risk to map</md-button>
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
        activeFoci: this.$store.state.foci.activeFoci
      }
    }
  }
</script>

<style scoped>
  .fab-container {
    position: relative;
  }

  .fab-container .md-fab {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
  }

  .foci-detail {
    padding: 20px 10px;
  }
</style>