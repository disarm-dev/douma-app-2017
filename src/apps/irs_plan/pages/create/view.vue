<template>
  <div>
    <div class="container">
      <div>
        <h3>Selection stats</h3>
        <p>There are {{result_clusters.length}} clusters in the selected localities. There are {{result_clusters.length * 10}} structures.</p>
      </div>

      <md-button-toggle md-single>
        <md-button v-for='action in actions' @click.native='set_action(action)' :ref='action.command'>
          {{action.title}}
        </md-button>
      </md-button-toggle>

      <div class="controls">

        <!-- DYNAMIC COMPONENT -->
        <keep-alive>
          <component 
            :is='selected_component'
            :formal_areas='formal_areas'
            :informal_draw_stack='informal_draw_stack'
            :show_preview='show_preview'
          ></component>
        </keep-alive>
      </div>
    </div>

  </div>
</template>

<script>
  import FormalBulk from './formal_bulk.vue'
  import Draw from './draw.vue'
  import Result from './result.vue'
  import {mapState} from 'vuex'

  export default {
    name: 'AreasView',
    components: {FormalBulk, Draw, Result},
    props: [],
    mounted() {
      const country_code = this.country.slug
      this.$store.dispatch("irs_plan:load_formal_areas", country_code)
      this.$nextTick(() => {
        this.$refs['FormalBulk'][0].$el.click()
      })
    },
    data() {
      return {
        // Actions
        actions: [
          { title: 'Multiple', command: 'FormalBulk' },
          { title: 'hand-draw', command: 'Draw' },
          { title: 'Result', command: 'Result' }
        ],
      }
    },
    computed: {
      ...mapState({
        country: state => state.meta.country,
        selected_component: state => state.irs_plan.selected_component,
        formal_areas: state => state.irs_plan.formal_areas,
        informal_draw_stack: state => state.irs_plan.informal_draw_stack,
        show_preview: state => state.irs_plan.show_preview,
      }),
      result_clusters() {
        return this.$store.getters["irs_plan:result_clusters"]
      },
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
</style>



