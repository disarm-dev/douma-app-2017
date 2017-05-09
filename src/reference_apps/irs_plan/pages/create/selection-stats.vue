<template>
  <div>
    <h3>Selection stats</h3>
    <p>There are {{stats.clusters_count}} clusters in the selected areas. There are {{stats.structures_count}} structures.</p>
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
</template>

<script>
  import {mapState} from 'vuex'
  import numeral from 'numeral'

  export default {
    name: 'SelectionStats',
    props: [],
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
        const estimated_days = this.stats.structures_count / this.time_estimate.structures_per_team_per_day / this.time_estimate.number_of_teams
        return numeral(estimated_days).format('0.00')

      },
      ...mapState({
        stats: state => state.irs_plan.selected_cluster_stats
      })
    },
  }
</script>

<style scoped>
  input[type=number] {
    width: 50px;
  }
</style>