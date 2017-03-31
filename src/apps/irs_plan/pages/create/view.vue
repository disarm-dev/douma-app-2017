<template>
  <div>
    <div class="container">
      <div>
        <h3>Selection stats</h3>
        <p>There are SOME clusters in the selected localities. There are A FEW structures.</p>
      </div>

      <div class="controls">
        <formal-bulk></formal-bulk>
      </div>
    </div>

  </div>
</template>

<script>
  import FormalBulk from './formal_bulk.vue'
  import Draw from './draw.vue'
  import {mapState} from 'vuex'

  export default {
    name: 'AreasView',
    components: {FormalBulk, Draw},
    computed: {
      ...mapState({
        selected_component: state => state.irs_plan.selected_component
      })
    },
    methods: {
      set_action (action) {
        this.$store.commit('irs_plan:set_selected_component', action.command)
      }
    }
  }
</script>

<style>
  .container { margin: 10px; }
  .controls { background: #eaeaea; padding: 5px;}
    #map {
    min-height: 80vh;
  }
</style>
