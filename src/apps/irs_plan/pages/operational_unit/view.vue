<template>
  <div>
    <h1>OperationalUnitView</h1>
    <md-input-container>
      <label for="country_code">Country</label>
      <md-select name="country_code" v-model="country_code">
        <md-option value="SWZ">Swaziland</md-option>
        <md-option value="ZWE">Zimbabwe (Mat-South)</md-option>
      </md-select>
    </md-input-container>

    <label>Select risk threshold (i.e. cases per 1000 greater than this value)</label>
    <vue-slider v-bind="slider_options" v-model="risk_slider"></vue-slider>
    <div>Selected localities count = {{selected_localities.length}} </div>
    <md-button class='md-raised md-accent' @click.native='start_clustering'>Start clustering</md-button>
     <md-progress :md-indeterminate='$store.state.irs_record.sync_in_progress'></md-progress>


    <router-view :selected_localities='selected_localities'></router-view>
  
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component';

  export default {
    name: 'OperationalUnitView',
    components: {vueSlider},
    mounted() {
      this.$store.dispatch("irs_plan:get_localities")
    },
    // watch: {
    //   'risk_slider': 'filter_localities_by_risk'
    // },
    data() {
      return {
        country_code: 'SWZ',
        risk_slider: 0,
        slider_options: {
          min: 0,
          max: 5,
          interval: 0.1
        }
      }
    },
    computed: {
      selected_localities() {
        return this.$store.state.irs_plan.localities.filter(locality => {
          return locality.properties.MaxRisk >= this.risk_slider
        })
      }
    },
    methods: {
      start_clustering() {
        this.$store.dispatch("irs_plan:start_clustering")
          .then((res) => {
            console.log("Results from API", res)
            // this.$router.push({name: 'irs_plan:clusters'})
          })  
      }
    }
  }
</script>