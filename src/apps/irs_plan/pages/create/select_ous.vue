<template>
  <div>
    <div class='container'><h1>Select local areas to target Clustering</h1></div>

    <div v-if='sorted_localities.length === 0' class='container'>
      <p>
        Select which country to load local areas for.
      </p>
      <i>You can select Zimbabwe, but please note that the later 'IRS Record' parts will not work. For full 'end-to-end' functioning, please work with Swaziland.</i>
      <md-input-container>
        <label for="country_code">Country</label>
        <md-select name="country_code" v-model="country_code">
          <md-option value="SWZ">Swaziland</md-option>
          <md-option value="ZWE">Zimbabwe (Mat-South)</md-option>
        </md-select>
      </md-input-container>
      <md-button class='md-primary md-raised' @click.native='get_ous'>Load areas</md-button>
    </div>

    <div v-if='sorted_localities.length > 0' class='container'>
      <p>The local areas are displayed below. Change the slider to select a number of areas to target. For demonstration, they are already sorted by a proxy for risk (elevation), so the 'highest-risk' areas will be included first.</p>
      <p>The larger the number of areas selected, the longer the processing will take, and the larger the data created. For a quicker experience, choose a lower number.</p>
        <!-- SELECTION SLIDER -->
      <vue-slider v-bind="slider_options" v-model="risk_slider_value" ref='slider'></vue-slider>

      <h3>Summary of area selected for Clustering</h3>
      <p>Selected local areas: {{risk_slider_value}}</p>
      <p v-if='manual_locality_selection.added.length !== 0'>{{manual_locality_selection.added.length}} areas manually added</p>
      <p v-if='manual_locality_selection.removed.length !== 0'>{{manual_locality_selection.removed.length}} areas manually removed</p>

      <!-- START CLUSTERING BUTTON -->
      <mark-mode-buttons></mark-mode-buttons>

      <md-button class='md-raised md-accent' :disabled='!can_start_clustering' @click.native='confirm_clustering'>Start clustering</md-button>
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
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
  import 'mapbox-gl/dist/mapbox-gl.css'

  import MarkModeButtons from './mark_mode_buttons.vue'
  import vueSlider from 'vue-slider-component'

  export default {
    name: 'SelectOUs',
    components: {vueSlider, MarkModeButtons},
    data() {
      return {
        alert_content: '',
        mark_mode: 'none',
        can_start_clustering: true,
        country_code: 'SWZ',
        risk_slider_value: 50,
        slider_options: {
          min: 0,
          max: 100,
          interval: 1,
          lazy: true,
          tooltip: 'always',
          formatter: '{value} local areas'
        },
        map: {},
        localities_layer: null,
        manual_locality_selection: {
          removed: [], // Array of Features
          added: [] // Array of Features
        }
      }
    },
    watch: {
      // 'selected_localities': 'draw_localities',
      'risk_slider_value': 'watched'
    },
    mounted() {
      this.$nextTick(() => {
        this.get_ous() // TODO: @debug Stop loading OUs in `mounted`
      })
      // this.create_map()
      // this.add_localities_layer()
    },
    computed: {
      // slider_options() {
      //   return {
      //     min: 0,
      //     max: this.$store.state.irs_plan.localities.length,
      //     interval: 1
      //   }
      // },
      // selected_localities() {

      //   const result = this.sorted_localities.map((locality, index) => {
      //     locality.properties.selected = (index <= (this.risk_slider_value - 1)) ? 'yes' : 'no'
      //     return locality
      //   })

      //   return result

      // },
      sorted_localities() {
        return this.$store.state.irs_plan.localities.sort((a,b) => a.properties.MeanElev - b.properties.MeanElev)//.reverse()
      }
    },
    methods: {
      watched() {
        console.log('watched')
      },
      get_ous() {
        return this.$store.dispatch("irs_plan:get_ous", this.country_code).then(() => {
          const localities_length = this.$store.state.irs_plan.localities.length
          this.$nextTick(() => {
            this.$refs.slider.refresh()
          })
          // debugger
          this.risk_slider_value = localities_length
          this.slider_options.max = localities_length 
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
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA';
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox:// styles/mapbox/streets-v9',
            center: [31.50484892885717, -26.543508675283874],
            zoom: 7.34
        });
      },
      add_localities_layer() {
        this.map.on('load', () => {
          const selected_localities_copy = this.selected_localities.slice()

          this.localities_layer = this.map.addLayer({
            id: 'localities_layer', 
            type: 'fill',
            layout: {},
            paint: {
              'fill-outline-color': 'grey',
              "fill-opacity": {
                  "property": "selected",
                  "type": "categorical",
                  "stops": [
                      ['yes', 0.6],
                      ['no', 0.1]
                  ]
              },
              "fill-color": {
                  "property": "selected",
                  "type": "categorical",
                  "stops": [
                      ['yes', "red"],
                      ['no', "blue"]
                  ]
              }
                },
            source: {
              type: 'geojson',
              data: {type:'FeatureCollection', features: selected_localities_copy}
            }
          })

          const popup = new mapboxgl.Popup({
            closeButton: true
          })

          this.map.on('mousemove', e => {
            var features = this.map.queryRenderedFeatures(e.point, {
                layers: ['localities_layer']
            });

            // Change the cursor style as a UI indicator.
            this.map.getCanvas().style.cursor = features.length ? 'pointer' : '';
          })

          this.map.on('click', (e) => {

            var features = this.map.queryRenderedFeatures(e.point, {
                layers: ['localities_layer']
            });

            // // Remove things if no feature was found.
            // if (!features.length) {
            //     popup.remove();
            //     this.map.setFilter('localities_layer_highlighted', ['!=', 'selected', 'true']);
            //     overlay.style.display = 'none';
            //     return;
            // }

            // Single out the first found feature on mouseove.
            var feature = features[0];

            // if (this.manual_locality_selection)


            // feature.properties.selected = 'yes'

            // this.map.setFilter('localities_layer_highlighted', ['==', 'selected', 'true']);

            // var title = document.createElement('strong');
            // title.textContent = feature.properties.ClusterID + ' (' + feature.properties.NumStructures + ' structures)';


            // // Display a popup with the name of the cluster
            popup.setLngLat(e.lngLat)
                .setText(feature.properties.UniqLocCod)
                .addTo(this.map);
          })          
        })
      },
      draw_localities() {
        const selected_localities_copy = [...this.selected_localities] // Make a copy, otherwise Mapbox changes the value

        console.log('draw_localities', selected_localities_copy.length)
        this.map
          .getSource('localities_layer')
          .setData({type: 'FeatureCollection', features: selected_localities_copy})
      },
      add_remove_locality(locality) {
        console.log('add/remove locality', locality)
        // this.$router.push({name: 'irs_plan:locality', params: {locality_id: locality._id}})
      },
      mark_to_add() {
        if (this.mark_mode === 'add') {
          this.mark_mode = 'none'
        } else {
          this.mark_mode = 'add'
        }
      },
      mark_to_remove() {
        if (this.mark_mode === 'remove') {
          this.mark_mode = 'none'
        } else {
          this.mark_mode = 'remove'
        }
      }
    }
  }
</script>

<style scoped>
  #map {
    min-height: calc(100vh - 300px);
    z-index: 0;
  }
  .container {
    margin: 10px;
  }
</style>