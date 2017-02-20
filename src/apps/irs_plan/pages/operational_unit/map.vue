<template>
  <div>
    <div id='map'></div>
  </div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  export default {
    name: 'OperationalUnitMap',
    props: ['selected_localities'],
    data() {
      return {
        map: {},
        localities_layer: null
      }
    },
    watch: {
      // '$store.state.irs_plan.localities': 'draw_localities',
      'selected_localities': 'draw_localities',
    },
    mounted() {
      this.create_map()
      this.draw_localities()
    },
    methods: {
      create_map() {
        this.map = Leaflet.map('map', {
          tms: true,
          center: [-26.3231769,31.1380957],
          zoom: 10,
        });

        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        Leaflet.tileLayer(url).addTo(this.map)
      },
      draw_localities() {
        console.log('draw_localities')
        // Remove if exists
        let redrawing
        
        if (this.localities_layer) {
          redrawing = true
          this.map.removeLayer(this.localities_layer)
          this.localities_layer = null
        }

        // Return unless there are search_results to render
        if (this.$store.state.irs_plan.localities.length === 0) {
          return
        }

        let localities_geojson
        if (this.selected_localities.length == 0) {
          localities_geojson = this.$store.state.irs_plan.localities
        } else {
          localities_geojson = this.selected_localities
        }

        const localities_layer = L.geoJSON(localities_geojson, {
          style: (feature, layer) => {
            let style = { color: 'lightblue' }  
            // if (this.selected_localities.length !== 0) {
            //   style.color = green
            // }

            return style
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              console.log(feature)
              // let locality = Object.assign({}, feature.properties)
              // this.add_remove_locality(locality.original_locality)
            })
          }
        })
        this.map
          .addLayer(localities_layer)
        if (!redrawing) this.map.fitBounds(localities_layer.getBounds())
        this.localities_layer = localities_layer      
      },
      add_remove_locality(locality) {
        console.log('add/remove locality', locality)
        // this.$router.push({name: 'irs_plan:locality', params: {locality_id: locality._id}})
      }
    }
  }
</script>

<style scoped>
  #map {
    min-height: calc(100vh - 64px);
    z-index: 0;
  }
</style>