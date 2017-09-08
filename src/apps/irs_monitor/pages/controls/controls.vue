<template>
  <md-card class="card filter_select">
    <md-card-header>
      <div class="md-title" @click="show_filters = !show_filters">Filters</div>
    </md-card-header>

    <md-card-content v-show="show_filters">
      <aggregation_settings></aggregation_settings>
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
    props: ['responses'],
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
m
<style scoped>

</style>
