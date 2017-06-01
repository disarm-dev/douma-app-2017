<template>
  <div class='container'>
    <h1>IRS Plan</h1>
    <md-checkbox v-model="edit">Edit mode</md-checkbox>
    <md-button @click.native="$router.push('/irs/plan')">Save</md-button>

    <plan_map :data_ready="data_ready" :edit="edit"></plan_map>

    <md-card class="card"><md-card-content>
      <plan_summary :data_ready="data_ready"></plan_summary>
    </md-card-content></md-card>

  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import plan_summary from './plan-summary.vue'
  import plan_map from './plan-map.vue'

  export default {
    name: 'edit',
    components: {plan_summary, plan_map},
    data() {
      return {
        data_ready: false,
        edit: false
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
        .then(geojson => DOUMA_CACHE.geodata.all_target_areas = geojson)
        .then(() => fetch(`/static/api_testing/${this.slug}/spatial_hierarchy/${this.slug}.clusters.geojson`))
        .then(res => res.json())
        .then(geojson => {
          DOUMA_CACHE.geodata.clusters = geojson
          this.data_ready = true
        })
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
