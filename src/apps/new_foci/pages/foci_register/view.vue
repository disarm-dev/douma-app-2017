<template>
  <md-tabs :md-fixed="true">
    <md-tab md-label="Map">
      <foci-map></foci-map>
    </md-tab>

    <md-tab md-label="Summary Table">
      <foci-summary-table></foci-summary-table>
    </md-tab>

    <md-tab md-label="List">
      <foci-list></foci-list>
    </md-tab>
  </md-tabs>
</template>

<script>
  import FociSummaryTable from './summary_table.vue'
  import FociMap from './map.vue'
  import FociList from './list.vue'

  export default {
    name: 'FociRegisterView',
    components: {
      FociSummaryTable, FociMap, FociList
    },
    watch: {
    },
    created() {
    },
    data () {
      return {
        
      }
    },
    computed: {
    },
    methods: {

    }

  }
</script>
