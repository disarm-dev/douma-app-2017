<template>
  <div>
    <h1>Select local areas to target Clustering</h1>

    <div v-if='sorted_localities.length === 0'>
      <p>
        Select which country to load local areas for.
      </p>
      <md-input-container>
        <label for="country_code">Country</label>
        <md-select name="country_code" v-model="country_code">
          <md-option value="SWZ">Swaziland</md-option>
          <md-option value="ZWE">Zimbabwe (Mat-South)</md-option>
        </md-select>
      </md-input-container>
      <md-button class='md-primary md-raised' @click.native='get_ous'>Load areas</md-button>
    </div>

    <!-- SELECTION SLIDER -->
    <div v-if='sorted_localities.length > 0'>
      <p>The local areas are displayed below. Change the slider to select a number of areas to target. For demonstration, they are already sorted by a proxy for risk (elevation), so the 'highest-risk' areas will be included first.</p>
      <p>The larger the number of areas selected, the longer the processing will take, and the larger the data created. For a quicker experience, choose a lower number.</p>
      <md-input-container
        <label>Select number of localities</label>
        <vue-slider v-bind="slider_options" v-model="risk_slider"></vue-slider>

        <!-- START CLYSTERING BUTTON -->
        <md-button class='md-raised md-accent' :disabled='!can_start_clustering' @click.native='confirm_clustering'>Start clustering</md-button>
      </md-input-container>
    </div>
        
    <div id='map'></div>

    <md-dialog-confirm
      :md-content="alert_content"
      md-ok-text="Yes, cluster"
      md-cancel-text="No, let me change"
      @close="start_clustering"
      ref="dialog">
    </md-dialog-confirm>
  </div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  import vueSlider from 'vue-slider-component'

  export default {
    name: 'SelectOUs',
    components: {vueSlider},
    data() {
      return {
        confirm_large_clusters: false,
        alert_content: '',
        can_start_clustering: true,
        country_code: 'SWZ',
        risk_slider: 1,
        map: {},
        localities_layer: null
      }
    },
    watch: {
      'selected_localities': 'draw_localities',
    },
    mounted() {
      this.create_map()
      this.draw_localities()
    },
    computed: {
      slider_options() {
        return {
          min: 1,
          max: this.$store.state.irs_plan.localities.length,
          interval: 1
        }
      },
      selected_localities() {
        return this.sorted_localities.slice(0, this.risk_slider)
      },
      sorted_localities() {
        return this.$store.state.irs_plan.localities.sort((a,b) => a.properties.MeanElev - b.properties.MeanElev).reverse()
      }
    },
    methods: {
      get_ous() {
        return this.$store.dispatch("irs_plan:get_ous", this.country_code).then(() => {
          this.risk_slider = this.$store.state.irs_plan.localities.length
        })
      },
      confirm_clustering() {
        if(this.selected_localities.length === 0) {
          return
        } 

        if (this.country_code === 'SWZ' &&  this.selected_localities.length > 155) {
          this.alert_content = `You have selected ${this.selected_localities.length} areas to cluster. This could take a while. It will be faster if you select fewer areas. Do you want to continue?`
          return this.$refs.dialog.open()
        }

        this.start_clustering() 
      },
      start_clustering(confirm_value) {
        
        if (confirm_value == 'cancel') return 
        
        this.$store.commit("irs_plan:set_selected_localities", this.selected_localities)

        this.can_start_clustering = false

        this.$store.dispatch("irs_plan:start_clustering", this.country_code)
          .then((res) => {
            this.can_start_clustering = true
            if(res.error) {
              this.$refs.snackbar.open()
            } else {
              this.$router.push({name: 'irs_plan:create:preview'})
            }
          })
          .catch(() => {
            this.can_start_clustering = true
            this.$refs.snackbar.open()
          })
      },
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

        let localities_geojson = this.selected_localities

        const localities_layer = L.geoJSON(localities_geojson, {
          style: (feature, layer) => {
            let style = { color: 'lightblue' }  
            return style
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              console.log('click on feature', feature)
            })
          }
        })
        this.map
          .addLayer(localities_layer)

        this.map.fitBounds(localities_layer.getBounds())

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
    min-height: calc(100vh - 300px);
    z-index: 0;
  }
</style>