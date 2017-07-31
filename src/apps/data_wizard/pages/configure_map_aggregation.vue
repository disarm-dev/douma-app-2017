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
        <md-button @click.native="save">Save</md-button>
      </md-card-actions>
    </md-card>

  </div>
</template>

<script>
export default {
  name: 'configure_map_aggregation',
  data () {
    return {
      map_aggregation: ''
    };
  },
  computed: {
    aggregations() {
      return Object.keys(this.$store.state.data_wizard.aggregations)
    }
  },
  methods: {
    save() {
      console.log('map_aggregation', this.map_aggregation)
    }
  }
};
</script>

<style lang="css" scoped>
  .card {
    margin: 1em auto;
  }
</style>