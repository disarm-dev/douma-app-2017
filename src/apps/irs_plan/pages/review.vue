<template>
  <div>
    <h1>Review most recent plan</h1>
    <plan_map :edit='false'></plan_map>
    <plan_summary></plan_summary>
    <md-button @click.native="$router.push('/irs/plan/edit')">Edit</md-button>
  </div>
</template>

<script>
  import plan_summary from './plan-summary.vue'
  import plan_map from './plan-map.vue'

  export default {
    name: 'review',
    components: {plan_summary, plan_map}
  }

</script>

<style></style>
