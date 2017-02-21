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
    <md-button @click.native='get_ous'>Get OUs</md-button>

    <label>Select risk threshold (i.e. cases per 1000 greater than this value)</label>
    <vue-slider v-bind="slider_options" v-model="risk_slider"></vue-slider>
    <div>Selected localities count = {{selected_localities.length}} </div>
    <md-button v-if='selected_localities.length > 0' class='md-raised md-accent' @click.native='start_clustering'>Start clustering</md-button>
    <md-progress :md-indeterminate='$store.state.irs_record.sync_in_progress'></md-progress>

    <router-view :selected_localities='selected_localities'></router-view>
  
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component';

  export default {
    name: 'OperationalUnitView',
    components: {vueSlider},
    data() {
      return {
        country_code: 'SWZ',
        risk_slider: 0,
        slider_options: {
          min: 0,
          max: 5,
          interval: 0.5
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
      get_ous() {
        return this.$store.dispatch("irs_plan:get_ous", this.country_code)
      },
      start_clustering() {
        if(this.selected_localities.length === 0) return

        this.$store.commit("irs_plan:set_selected_localities", this.selected_localities)
        this.$store.dispatch("irs_plan:start_clustering", this.country_code)
          .then((res) => {
            this.$router.push({name: 'irs_plan:clusters'})
          })  
      },
    }
  }
</script>