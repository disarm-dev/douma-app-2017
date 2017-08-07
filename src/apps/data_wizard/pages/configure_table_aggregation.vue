<template>
  <div class="applet_container">

    <md-card class="card">
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
        <md-button @click.native="set_table_aggregations">Save</md-button>
      </md-card-actions>
    </md-card>

  </div>
</template>

<script>
export default {
  name: 'configure_table_aggregation',
  data () {
    return {
      table_aggregations: {},
    };
  },
  computed: {
    aggregations() {
      return Object.keys(this.$store.state.data_wizard.aggregations)
    }
  },
  methods: {
    set_table_aggregations() {
      console.log('table_aggregations', this.table_aggregations)
    }
  }
}
</script>

<style lang="css" scoped>
  .card {
    margin: 1em auto;
  }
</style>