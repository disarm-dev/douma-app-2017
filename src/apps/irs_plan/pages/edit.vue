<template>
  <div class='container'>
    <h1>IRS Plan</h1>
    <md-button @click.native="$router.push('/irs/plan')">Save</md-button>

    <plan_map edit="false"></plan_map>

    <md-card class="card"><md-card-content>
      <h1>Don't forget the SUMMARY</h1>
        <!--<plan_summary></plan_summary>-->
    </md-card-content></md-card>

  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import plan_summary from './plan-summary.vue'
  import plan_map from './plan-map.vue'


  export default {
    name: 'IRSPlan',
    components: {plan_summary, plan_map}
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
