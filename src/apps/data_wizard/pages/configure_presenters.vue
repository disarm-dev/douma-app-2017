<template>
  <div class="applet_container">
    <md-card class="card">
      <md-card-header>
        <div class="md-title">Select aggregation for use on monitor map</div>
      </md-card-header>
      <md-card-content>
        
        <md-list>
          <md-list-item v-for="aggregation in aggregations" :key="aggregation">
            <span>{{aggregation}}</span>
            <md-radio :md-value="aggregation" name="map_aggregation" v-model="map_aggregation"></md-radio>
          </md-list-item>
        </md-list>

      </md-card-content>
      <md-card-actions>
        <md-button @click.native="select_map_aggregation">Continue</md-button>
      </md-card-actions>
    </md-card>

    <md-card class="card" v-if="show_aggregations_for_table">
      <md-card-header>
        <div class="md-title">Select aggregations for use on monitor table</div>
      </md-card-header>
      <md-card-content>
        
        <md-list>
          <md-list-item v-for="aggregation in aggregations" :key="aggregation">
            <span>{{aggregation}}</span>
            <md-checkbox :md-value="aggregation" name="map_aggregation" v-model="table_aggregations[aggregation]"></md-checkbox>
          </md-list-item>
        </md-list>
        
      </md-card-content>
      <md-card-actions>
        <md-button @click.native="save_and_continue">Finish</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'configure_presenters',
  data () {
    return {
      aggregations: ['agg1', 'agg2', 'agg3'],
      show_aggregations_for_table: false,

      table_aggregations: {},
      map_aggregation: ''
    };
  },
  methods: {
    select_map_aggregation() {
      console.log('map_aggregation', this.map_aggregation)
      this.show_aggregations_for_table = true
    },
    save_and_continue() {
      console.log('table_aggregations', this.table_aggregations)

    }
  }
};
</script>

<style lang="css" scoped>
  .card {
    margin: 1em auto;
  }
</style>