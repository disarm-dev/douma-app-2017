<template>
  <div>
    <div class="container">
      <md-button-toggle md-single>
        <md-button v-for='action in actions' @click.native='set_action(action)'>
          {{action.title}}
        </md-button>
      </md-button-toggle>

      <div class="controls">
        <component :is='$store.state.irs_areas.selected_command' :result_areas='result_areas'></component>
        <md-checkbox v-if='$store.state.irs_areas.selected_command !== "Result"' v-model="show_preview">Show preview</md-checkbox>
      </div>

    </div>

    <areas-map :result_areas='result_areas'></areas-map>

  </div>
</template>

<script>
  import AreasMap from './map.vue'
  import FormalBulk from './formal_bulk.vue'
  import FormalSingle from './formal_single.vue'
  import Draw from './draw.vue'
  import Result from './result.vue'

  export default {
    name: 'AreasView',
    components: {AreasMap, FormalBulk, FormalSingle, Draw, Result},
    props: [],
    data() {
      return {
        show_preview: false,
        // Actions
        actions: [
          { title: 'Multiple', command: 'FormalBulk' }, 
          { title: 'Single', command: 'FormalSingle' }, 
          { title: 'hand-Draw', command: 'Draw' },
          { title: 'Result', command: 'Result' }
        ],
      }
    },
    computed: {
      result_areas() {
        return this.$store.getters["irs_areas/result_areas"]
      }
    },
    methods: {
      set_action (action) {
        this.$store.commit('irs_areas/set_selected_command', action.command)
      }
    }
  }
</script>

<style>
  .container { margin: 10px; }
  .controls { background: #eaeaea; padding: 5px;}
</style>



