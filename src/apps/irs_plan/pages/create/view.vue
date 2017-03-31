<template>
  <div>
    <div class="container">
      <div>
        <h3>Selection stats</h3>
        <p>There are SOME clusters in the selected localities. There are A FEW structures.</p>
      </div>

      <!-- <md-button-toggle md-single>
        <md-button v-for='action in actions' @click.native='set_action(action)' :ref='action.command'>
          {{action.title}}
        </md-button>
      </md-button-toggle> -->

      <div class="controls">
        <formal-bulk></formal-bulk>
        <!-- DYNAMIC COMPONENT -->
        <!-- <keep-alive>
          <component :is='selected_component'></component>
        </keep-alive> -->
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
      // this.$nextTick(() => { // Hack for vue-material tabs
      //   this.$refs['FormalBulk'][0].$el.click()
      // })
    },
    data() {
      return {
        // Actions
        actions: [
          { title: 'Multiple', command: 'FormalBulk' },
          // { title: 'hand-draw', command: 'Draw' },
          { title: 'Result', command: 'Result' }
        ],
      }
    },
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
</style>
