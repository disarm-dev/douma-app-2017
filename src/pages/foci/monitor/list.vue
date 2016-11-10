<template>
  <div class="monitor-list">
    <md-button class="md-raised md-accent" @click="$router.push({name: 'monitor:map'})">Map</md-button>

    <md-card class="foci-card">
      <md-card-header>
        <div class="md-title">Foci in Lobamba</div>
      </md-card-header>
      <md-card-content>
        <md-list class="md-double-line">
          
          <md-list-item v-for='foci in focis.features'>
            <md-icon class="md-primary">blur_on</md-icon>

            <div class="md-list-text-container">
              <span>{{foci.properties.name}}</span>
            </div>

            <md-button class="md-accent">Read more</md-button>
          </md-list-item>

        </md-list>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        focis: this.$store.state.focis
      }
    },
    mounted() {
      console.log(this.focis)
    }
  }
</script>

<style scoped>
  .monitor-list {
    margin: 2em 1em;
  }

  .foci-card {
    max-width: 800px;
    margin: 0 auto;
  }

</style>