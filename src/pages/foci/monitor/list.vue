<template>
  <div class='fab-container'>
    <md-button class="md-fab md-clean" @click="$router.push({name: 'foci:monitor:map'})">
      <md-icon>location_on</md-icon>
    </md-button>
    <div class="monitor-list">    
      <div class="md-title">Recent foci</div>
      <md-list class="md-double-line">
        
        <md-list-item v-for='foci in focis.features' @click="goToFoci(foci)">
          <md-icon class="md-primary">blur_on</md-icon>

          <div class="md-list-text-container">
            <span>{{foci.properties.id}}</span>
            <span>{{foci.properties.classification}}</span>
          </div>

        </md-list-item>

      </md-list>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        focis: this.$store.state.focis
      }
    },
    methods: {
      viewMap() {
        this.$router.push({name: 'foci:monitor:map'})
      },
      goToFoci(foci) {
        this.$store.commit('setActiveFoci', foci.properties.id)
        this.$router.push({name: 'foci:investigate'})
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

  .monitor-list {
    padding: 20px 10px;
  }

</style>