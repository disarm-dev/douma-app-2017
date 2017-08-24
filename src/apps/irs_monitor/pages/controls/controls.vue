<template>
  <md-card class="card filter_select">
    <md-card-header>
      <div class="md-title" @click="show_filters = !show_filters">Controls</div>
    </md-card-header>

    <md-card-content v-show="show_filters">
      <aggregation_settings></aggregation_settings>
      <filters></filters>
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
    mounted() {
    },
    data() {
      return {
        show_filters: false,

      }
    },
    methods: {}
  }
</script>

<style scoped>

</style>
