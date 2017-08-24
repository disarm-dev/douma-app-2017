<template>
  <div class="charts">
    <md-card
      v-for="chart in options"
      :key="chart.id"
      class="card"
      :class="{'card-half-width': chart.style.width_constraint == 'half'}">

        <custom_chart
          :chart_id="chart.id"
          :responses="responses"
          :targets="targets"
          :aggregations="aggregations"
          :options="chart.options"
        >
        </custom_chart>
    </md-card>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import custom_chart from './chart.vue'

  export default {
    name: 'custom-charts',
    props: ['responses', 'targets', 'aggregations', 'options'], // `options` is an array of chart configurations
    components: {custom_chart}
  }
</script>

<style scoped>
  .charts {
    display: flex;
    flex-flow: row wrap;
  }

  .card {
    margin: 0.5em;
    flex: 1 1 calc( 33% - 1em );
    min-width: 280px;
  }
  /*TODO: @feature reimplement this*/

  .card-half-width {
    /* width: 45%; */
  }
</style>
