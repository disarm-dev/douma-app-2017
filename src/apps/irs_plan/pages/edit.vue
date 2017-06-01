<template>
  <div class='container'>
    <h1>IRS Plan</h1>
    <md-button @click.native="$router.push('/irs/plan')">Save</md-button>

    <plan_map :all_target_areas="all_target_areas" edit="false"></plan_map>

    <md-card class="card"><md-card-content>
      <plan_summary :all_target_areas="all_target_areas"></plan_summary>
    </md-card-content></md-card>

  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import plan_summary from './plan-summary.vue'
  import plan_map from './plan-map.vue'


  export default {
    name: 'IRSPlan',
    components: {plan_summary, plan_map},
    data() {
      return {
        all_target_areas: null
      }
    },
    computed: {
      ...mapState({
        denominator: state => state.instance_config.denominator,
        slug: state => state.instance_config.slug.toLowerCase(),
      })
    },
    mounted() {
      fetch(`/static/api_testing/${this.slug}/spatial_hierarchy/${this.slug}.${this.denominator.aggregate_to}.geojson`)
        .then(res => res.json())
        .then(geojson => this.all_target_areas = geojson)
    }
  }
</script>

<style scoped>
  .container {
    margin: 0 auto;
    width: 90%;
    padding: 10px;
  }

  .card {
    margin-top: 10px;
  }
</style>
