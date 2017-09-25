<template>
  <md-card class="card filter_select filter-container">
    <md-card-header>
      <div class="md-title" @click="show_filters = !show_filters">
        <md-icon v-if="show_filters">keyboard_arrow_down</md-icon>
        <md-icon v-else>keyboard_arrow_right</md-icon>
        Filters
      </div>
    </md-card-header>

    <md-card-content v-show="show_filters">
      <aggregation_settings :responses="responses" :targets="targets"></aggregation_settings>
      <filters :responses="responses"></filters>
    </md-card-content>

  </md-card>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex'
  import aggregation_settings from './aggregation-settings.vue'
  import filters from './filters/filters.vue'

  export default {
    name: 'controls',
    components: {filters, aggregation_settings},
    props: ['responses', 'targets'],
    computed: {
      show_filters: {
        get(){
          return this.$store.state.irs_monitor.ui.show_filters
        },
        set(val){
          this.$store.commit('irs_monitor/set_ui', {show_filters: val})
        }
      }
    },
  }
</script>

<style scoped>
  .filter-container {
    z-index: 4;
    overflow: visible;
  }
</style>
