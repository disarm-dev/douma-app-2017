<template>

  <div class="monitor-list">
    <div class="switch-container">
      <md-switch class="switch" :value="true"  @change="viewMap">
        List view
      </md-switch>
    </div>

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
              <span>{{foci.properties.location}}</span>
            </div>

            <md-button class="md-accent" @click="goToFoci(foci)">Read more</md-button>
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
    methods: {
      viewMap() {
        this.$router.push({name: 'monitor:map'})
      },
      goToFoci(foci) {
        this.$store.commit('setActiveFoci', foci.properties.id)
        this.$router.push({name: 'investigate'})
      }
    }
  }
</script>

<style scoped>
  .monitor-list {
    /*margin: 2em 1em;*/
    margin-right: 1em;
    margin-left: 1em;
  }

  .foci-card {
    max-width: 800px;
    margin: 0 auto;
  }

</style>