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
    <vue-slider v-model="risk_slider"></vue-slider>
    <router-view></router-view>
  
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
    data() {
      return {
        country_code: 'SWZ',
        risk_slider: 5
      }
    }
  }
</script>