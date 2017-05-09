<template>
  <div>
    <div class='container'>
      <h1 class="md-display-1">IRS Monitor</h1>
      <p>This page provides an overview of the activity on the current set of Clusters.</p>
    </div>

    <div class="boxes">

      <div v-if='!data_loaded'>
        <div class='md-headline'>Loading data...</div>
      </div>

      <template v-if='data_loaded && only_zeroes_returned'>
        <div class='md-headline'>No data found - have you created any Clusters yet?</div>
      </template>

      <template v-if='data_loaded && !only_zeroes_returned'>

        <div class="box">
          <md-card>
            
            <p class="big-number">{{round(((structuresUnsuccessfullyVisited + structuresSuccessfullyVisited) / tasks_total) * 100)}} %</p>

            <md-card-header>
              <!-- TODO: @debug Replace with real numbers -->
              <div class="md-title">n of n structures visited</div>
              <div class="md-subhead">in {{country.name}}</div>
            </md-card-header>

          </md-card>
        </div>

        <div class="box">
          <md-card>
            
            <p class="big-number">{{round((structuresSuccessfullyVisited / tasks_total) * 100)}} %</p>

            <md-card-header>
              <div class="md-title">Structures successfully visited</div>
              <div class="md-subhead">in {{country.name}}</div>
            </md-card-header>

          </md-card>
        </div>

        <div class="box">
          <md-card>
            
            <p class="big-number">{{round((structuresUnsuccessfullyVisited / tasks_total) * 100)}} %</p>

            <md-card-header>
              <div class="md-title">Structures unsuccessfully visited</div>
              <div class="md-subhead">in {{country.name}}</div>
            </md-card-header>

          </md-card>
        </div>

        <div class="box">
          <md-card>
            
            <p class="big-number">{{clusters_total}}</p>

            <md-card-header>
              <div class="md-title">Clusters </div>
              <div class="md-subhead">in {{country.name}}</div>
            </md-card-header>

          </md-card>
        </div>
      </template>
      
    </div>

      <div class="box map-box">
        <md-card>
          
          <div id="map"></div>

        </md-card>
      </div>   

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'

  export default {
    name: 'DashboardView',
    watch: {
      '$store.state.irs.clusters': 'add_clusters'
    },
    mounted() {
      // clusters aren't in state, have to load them to show them on the map
      this.$store.dispatch("irs:get_clusters").then(() => {
        this.$store.dispatch('irs_record:load_saved_clusters')
      })
      this.create_map().then(() => {
        this.add_clusters()
      })
      this.$store.dispatch('irs_monitor:set_demo_instance_id', this.$store.state.meta.demo_instance_id)
      this.$store.dispatch('irs_monitor:get_monitor_data').then(() => this.data_loaded = true)
    },
    data() {
      return {
        _map: null,
        data_loaded: false
      }
    },
    computed: {
      ...mapState({
        country: state => state.meta.country
      }),
      structuresSuccessfullyVisited() {
        return this.$store.state.irs_monitor.taskCounts.visited_successful
      },
      structuresUnsuccessfullyVisited() {
        return this.$store.state.irs_monitor.taskCounts.visited_unsuccessful
      },
      structuresUnvisited() {
        return this.$store.state.irs_monitor.taskCounts.unvisited
      },
      tasks_total() {
        return this.$store.state.irs_monitor.taskCounts.total
      },
      clusters_total() {
        return this.$store.state.irs_monitor.clusterCount
      },
      only_zeroes_returned() {
        return ((this.$store.state.irs_monitor.taskCounts.total === 0) && (this.$store.state.irs_monitor.clusterCount === 0))
      }
    },
    methods:{
      round(num) {
        return parseFloat(Math.round(num * 100) / 100).toFixed(2);
      },
      create_map() {
        let country = this.$store.state.meta.country
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        return new Promise((resolve, reject) => {
          this._map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
            center: [country.centre.lng, country.centre.lat],
            zoom: country.zoom
          });
          this._map.on('load', () => resolve())
        })
      },
      add_clusters() {

        if (this._map.getLayer('clusters')) {
          this._map.removeLayer('clusters')
          this._map.removeSource('clusters')
        }

        this._map.addLayer({
          'id': 'clusters', // every locality, doesn't change
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': {type: 'FeatureCollection', features: this.$store.state.irs.clusters }
          },
          'paint': {
            'fill-opacity': 0.5,
            'fill-color': 'blue'
          }
        }) 
      }
    }
  }
</script>

<style>
  .container {margin: 10px;}
  .boxes {
    display: flex;
    flex-wrap: wrap; 
    margin: 1em;
  }

  .box {
    flex: 1;
    flex-basis: 100%;
  }

  .box > * {
    margin: 1em;
  }

  @media (min-width: 700px) {
    .box {
      flex-basis: 50%;
    }
  }

  @media (min-width: 1000px) {
    .box {
      flex-basis: 33.33%;
    }
  }

  .big-number {
    font-size: 3em;
    text-align: center;
    margin-top: 25px;
  }

  #map {
    height: 350px;
  }

  .map-box {
    padding-bottom: 2em;
  }
</style>