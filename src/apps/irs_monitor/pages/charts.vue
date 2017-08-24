<template>
  <div>
    <md-card
      v-for="chart in options"
      :key="chart.id"
      class="card"
      :class="{'card-half-width': chart.style.width_constraint == 'half'}">

      <md-card-content>
        <custom_chart
          :chart_id="chart.id"
          :responses="responses"
          :targets="targets"
          :aggregations="aggregations"
          :options="chart.options"
        >
        </custom_chart>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import custom_chart from './chart.vue'

  export default {
    name: 'custom-charts',
    props: ['responses', 'targets', 'aggregations', 'options'],
    components: {custom_chart}
  }
</script>

<style scoped>
  .card {
    display: inline-block;
    margin: 2.5%;
    padding: 1em;
    flex: 1;
    width: 95%;
  }

  .card-half-width {
    width: 45%;
  }
</style>
