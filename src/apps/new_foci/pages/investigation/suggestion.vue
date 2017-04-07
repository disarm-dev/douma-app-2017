<template>
  <div class="investigation-container">
    <div class="investigation-infobox">
      <div class="md-title">Foci suggestion</div>
      <md-button class="md-raised md-primary" v-if="!driver_of_risk_added" @click.native="add_driver_of_risk">Add driver of risk</md-button>
      <md-button class="md-raised md-accent" v-if="!guessed_boundary && driver_of_risk_added" @click.native="guess_boundary">Guess boundary</md-button>
      <md-button class="md-raised md-accent" v-if="guessed_boundary" @click.native="save">Save</md-button>
    </div>
    <div id="map"></div>
  </div>
</template>
<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
  import {mapState, mapGetters} from 'vuex'
  import turf from '@turf/turf'
  import Points_fc from '../../points_fc.json'

  let driver_of_risk = {
    "type": "Feature",
    "properties": {
      "title": 'DOR'
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        31.918110251426697,
        -26.213830620133383
      ]
    }
  }

  export default {
    data() {
      return {
        _map: null, 

        points_fc: null,
        driver_of_risk_added: false,
        guessed_boundary: false,
        new_foci: null
      }
    },
    mounted() {
      this.create_map().then(() => {
        this.add_points_layer(Points_fc)
      })
    },
    methods: {
      create_map() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        return new Promise((resolve, reject) => {
          this._map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
            center: [31.91765, -26.21374],
            zoom: 18
          });
          this._map.on('load', () => resolve())
        })
      },
      add_points_layer(points_fc) {
        this.points_fc = points_fc
        this._map.addLayer({
          'id': 'points', 
          'type': 'symbol',
          'source': {
            'type': 'geojson',
            'data': points_fc
          },
           "layout": {
            // "icon-image": "{icon}-15",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
          }
          // 'paint': {
            
          // }
        }) 
      },
      add_driver_of_risk() {
        this.driver_of_risk_added = true
        
        this._map.addLayer({
          'id': 'dor', 
          'type': 'symbol',
          'source': {
            'type': 'geojson',
            'data': {
              type: 'FeatureCollection',
              features: [driver_of_risk]
            }
          },
           "layout": {
            // "icon-image": "{icon}-15",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
          }
        }) 
      },

      guess_boundary() {
        this.guessed_boundary = true
        let points = Points_fc
        points.features.push(driver_of_risk)
        let hull = turf.convex(points)
        console.log(hull)
        this.new_foci = turf.buffer(hull, 10, 'metres')
        this._map.addLayer({
          'id': 'foci', 
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': {type: 'FeatureCollection', features: [this.new_foci] }
          },
          'paint': {
            'fill-outline-color': 'grey',
            'fill-opacity': 0.5,
            'fill-color': '#F44336'
          }
        }) 
      },

      save() {
        this.new_foci.properties = {
          "_id": "cea1c75a-04c5-4f17-b0f1-52283c4235bd",
          "location": "Simunye",
          "structures": 91,
          "status": "Active",
          "cases": 43,
        }

        this.$store.commit('foci:add_foci', this.new_foci)
        this.$router.push({name: 'foci:investigation', params: {foci_id: this.new_foci.properties._id}})
      }
    }
  }
</script>