<template>
  <div>
    <md-radio
        v-for="aggregation in aggregation_names"
        :key="aggregation"
        :value="selected_layer"
        @input="set_selected_layer"
        name="map-type"
        :md-value="aggregation"
    >
      {{aggregation}}
    </md-radio>


    <md-radio :value="selected_layer" @input='set_selected_layer' name="map-type" md-value="normalised_risk">Risk</md-radio>
    <md-radio :value="selected_layer" @input='set_selected_layer' name="map-type" md-value="none">Nothing</md-radio>

  </div>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex'

  export default {
    name: 'layer-selector',
    props: ['aggregation_names', 'selected_layer'],
    data() {
      return {}
    },
    methods: {
      set_selected_layer(layer_string) {
        this.$emit('change', layer_string)
      }
    }
  }
</script>

<style scoped>

</style>