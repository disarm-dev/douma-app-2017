<template>
  <no-active-foci v-if='!activeFoci' />
  <div v-else class='fab-container'>
    <div class="fab-buttons">
      <md-button class="md-fab md-clean" @click="$router.push({name: 'foci:investigate:detail'})">
        <md-icon>info_outline</md-icon>
      </md-button>
      <md-button class="md-fab md-clean md-accent">
        <md-icon>add</md-icon>
      </md-button>
    </div>
    <div id="investigate-map"></div>
  </div>
</template>

<script>
  import NoActiveFoci from '../../../components/no-active-foci.vue'

  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  export default {
    components: {
      NoActiveFoci
    },
    data() {
      return {
        map: {},
        activeFoci: this.$store.state.foci.activeFoci,
        activeFociLayer: {}
      }
    },
    mounted() {
      if (!this.activeFoci) return
      this.map = Leaflet.map('investigate-map', {
        tms: true,
        center: [-26.3231769,31.1380957],
        zoom: 10,
      });

      this.$parent.$on('show', () => {
        this.map.invalidateSize()
        this.map.fitBounds(this.focisLayer.getBounds())
      })

      const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'
      Leaflet.tileLayer(url).addTo(this.map); 
      this.loadActiveFoci()
    },
    methods: {
      loadActiveFoci() {
        this.activeFociLayer = Leaflet.geoJSON(this.activeFoci).addTo(this.map)
        this.map.fitBounds(this.activeFociLayer.getBounds())
      }
    }

  }
</script>

<style scoped>
  .fab-container {
    position: relative;
  }

  .fab-buttons {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
  }

  #investigate-map {
    z-index: 0;
    min-height: 85vh;
    overflow: hidden;
  }

</style>