<template>
  <div>
    <div class='container'><h1>Select local areas to target Clustering</h1></div>

    <div v-if='localities_selected_by_risk.length === 0' class='container'>
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

    <div v-if='localities_selected_by_risk.length > 0' class='container'>
      <p>The local areas are displayed below. Change the slider to select a number of areas to target. For demonstration, they are already sorted by a proxy for risk (elevation), so the 'highest-risk' areas will be included first.</p>
      <p>The larger the number of areas selected, the longer the processing will take, and the larger the data created. For a quicker experience, choose a lower number.</p>

      <!-- SELECTION SLIDER -->
      <vue-slider v-bind="slider_options" v-model="risk_slider_value" ref='slider'></vue-slider>

      <h3>Summary of area selected for Clustering</h3>
      <p>Selected local areas: {{risk_slider_value}}</p>
      <p v-if='$store.state.irs_plan.manually_selected_areas.add.length !== 0'>{{$store.state.irs_plan.manually_selected_areas.add.length}} areas clicked to manually add</p>
      <p v-if='$store.state.irs_plan.manually_selected_areas.remove.length !== 0'>{{$store.state.irs_plan.manually_selected_areas.remove.length}} areas clicked to manually remove</p>
      <p v-if='$store.state.irs_plan.manually_drawn_areas.add.length !== 0'>{{$store.state.irs_plan.manually_drawn_areas.add.length}} drawn areas to manually add</p>
      <p v-if='$store.state.irs_plan.manually_drawn_areas.remove.length !== 0'>{{$store.state.irs_plan.manually_drawn_areas.remove.length}} drawn areas to manually remove</p>

      <!-- SELECT MAP DRAWING MODE -->
      <mark-mode-buttons></mark-mode-buttons>

      <!-- START CLUSTERING BUTTON -->
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
        // The MAP
        map: {},

        // Control
        alert_content: '',
        can_start_clustering: true,
        
        // Temporary state - should be elsewhere?
        country_code: 'SWZ',
        
        //  Slider
        risk_slider_value: 0,
        slider_options: {
          min: 0,
          max: 1,
          interval: 1,
          lazy: true,
          tooltip: 'always',
          formatter: '{value} local areas'
        },
      }
    },
    mounted() {
      this.get_ous() // TODO: @debug Stop loading OUs in `mounted`

      this.map = this.create_map()
      this.map.on('load', () => { // Wait until map is ready to start drawing on it
        this.$watch('_areas_to_render', this.draw_selected_areas)
        this.draw_selected_areas()
      })
    },
    computed: {
      localities_selected_by_risk() {
        const sorted_localities = this.$store.state.irs_plan.localities.sort((a,b) => a.properties.MeanElev - b.properties.MeanElev)
        const result = sorted_localities.slice(0, this.risk_slider_value)
        console.log('result', result.length)
        return result
      },
      _areas_to_render() {
        const localities_selected_by_risk = JSON.parse(JSON.stringify(this.localities_selected_by_risk))
        // const localities_to_add = this.$store.state.irs_plan.manually_selected_areas.add
        // const localities_to_remove = this.$store.state.irs_plan.manually_selected_areas.remove
        // const areas_to_add = this.$store.state.irs_plan.manually_drawn_areas.add
        // const areas_to_remove = this.$store.state.irs_plan.manually_drawn_areas.remove
        return localities_selected_by_risk
      }
    },
    methods: {
      get_ous() {
        return this.$store.dispatch("irs_plan:get_ous", this.country_code).then(() => {
          // Update slider UI to match localities
          const localities_length = this.$store.state.irs_plan.localities.length
          this.risk_slider_value = localities_length
          this.slider_options.max = localities_length 
        })
      },
      confirm_clustering() {
        // TODO: @fix Watch something other than localities_selected_by_risk
        if(this.localities_selected_by_risk.length === 0) {
          return
        } 

        // TODO: @refac Check something different to stop large clustering
        if (this.country_code === 'SWZ' &&  this.localities_selected_by_risk.length > 155) {
          this.alert_content = `You have selected ${this.localities_selected_by_risk.length} areas to cluster. This could take a while. It will be faster if you select fewer areas. Do you want to continue?`
          return this.$refs.dialog.open()
        }

        this.start_clustering() 
      },
      start_clustering(confirm_value) {
        
        if (confirm_value == 'cancel') return 
        
        this.$store.commit("irs_plan:set_areas_to_cluster", this._areas_to_render)

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
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'
        return new mapboxgl.Map({
            container: 'map',
            style: 'mapbox:// styles/mapbox/streets-v9',
            center: [31.50484892885717, -26.543508675283874],
            zoom: 7.34
        })
      },
      _add_localities_layer() {

        this.map.addLayer({
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
            data: {type:'FeatureCollection', features: this._areas_to_render}
          }
        })

        // const popup = new mapboxgl.Popup({
        //   closeButton: true
        // })

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

          const current_state = feature.properties.selected
          console.log(current_state, feature)
          feature.properties.selected = true

          // if (!this.$store.state.irs_plan.manually_selected_areas.add.includes(feature)) {
          //   this.$store.commit('irs_plan:manually_add_area', locality)
          // }
          // if (!this.$store.state.irs_plan.manually_selected_areas.remove.includes(feature)) {
          //   this.$store.commit('irs_plan:manually_remove_area', locality)
          // }

        })          
      },
      draw_selected_areas() {
        // Add localities_layer on first render
        if (!this.map.getSource('localities_layer')) {
          this._add_localities_layer()
        }

        // Otherwise re-render with different data
        this.map.getSource('localities_layer').setData({type: 'FeatureCollection', features: this._areas_to_render})
        console.log('done draw_selected_areas')
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