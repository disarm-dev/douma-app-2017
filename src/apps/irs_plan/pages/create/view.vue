<template>
  <div>
    <div class="container">
      <div style="background: fuschia;">
        <p>There are x structures in the selected localities</p>
      </div>

      <md-button-toggle md-single>
        <md-button v-for='action in actions' @click.native='set_action(action)'>
          {{action.title}}
        </md-button>
      </md-button-toggle>
      
      <div class="controls">

        <!-- DYNAMIC COMPONENT -->
        <component 
          :is='$store.state.irs_plan.selected_command' 
          :formal_areas='formal_areas'
          :informal_draw_stack='informal_draw_stack'
          :show_preview='show_preview'
        ></component>
        
      </div>

    </div>

  </div>
</template>

<script>
  import FormalBulk from './formal_bulk.vue'
  import Draw from './draw.vue'
  import Result from './result.vue'

  export default {
    name: 'AreasView',
    components: {FormalBulk, Draw, Result},
    props: [],
    watch: {'show_preview_local': 'proxy_show_preview'},
    mounted() {
      const country_code = 'SWZ' // TODO: @debug Change from hardcoded country_code
      return this.$store.dispatch("irs_plan:load_formal_areas", country_code)
    },
    data() {
      return {
        formal_areas: [],
        informal_draw_stack: [],
        informal_result_stack: [],
        show_preview_local: false,
        // Actions
        actions: [
          { title: 'Multiple', command: 'FormalBulk' },
          { title: 'hand-draw', command: 'Draw' },
          { title: 'Result', command: 'Result' }
        ],
      }
    },
    computed: {
      result_areas() {
        return this.$store.getters["irs_plan:result_areas"]
      },
      show_preview() {
        return this.$store.state.irs_plan.show_preview
      }
    },
    methods: {
      proxy_show_preview() {
        this.$store.commit('irs_plan:set_show_preview', this.show_preview_local)
      },
      set_action (action) {
        this.$store.commit('irs_plan:set_selected_command', action.command)
      }
    }
  }
</script>

<style>
  .container { margin: 10px; }
  .controls { background: #eaeaea; padding: 5px;}
</style>



