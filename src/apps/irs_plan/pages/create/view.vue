<template>
  <div>
    <div class="container">
      <div>
        <h3>Selection stats</h3>
        <p>There are {{stats.clusters_count}} clusters in the selected localities. There are {{stats.structures_count}} structures.</p>
        <p><i>
          At a rate of 
          <input v-model='time_estimate.structures_per_team_per_day' type='number'>   
          structures per team per day, 
          with 
          <input v-model='time_estimate.number_of_teams' type='number'>   
          teams
          this would take
          {{time_estimate_days}} days
        </i></p>
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
    data() {
      return {
        time_estimate: {
          structures_per_team_per_day: 40,
          number_of_teams: 20
        }
      }
    },
    computed: {
      time_estimate_days() {
        return this.stats.structures_count / this.time_estimate.structures_per_team_per_day / this.time_estimate.number_of_teams
      },
      ...mapState({
        selected_component: state => state.irs_plan.selected_component,
        stats: state => state.irs_plan.selected_cluster_stats
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
