<template>
  <div class="applet_container">
    <md-card v-if="!applets.irs_monitor">
      <md-card-header>
        <div class="md-title">Cannot select aggregations for Monitor component: Monitor component is not selected</div>
      </md-card-header>
    </md-card>

    <md-card class="card" v-else>
      <md-card-header>
        <div class="md-title">Select aggregation for use on monitor map</div>
      </md-card-header>
      <md-card-content>

        <md-list>
          <md-list-item v-if="aggregation_name_array" v-for="aggregation in aggregation_name_array" :key="aggregation">
            <span>{{aggregation}}</span>
            <md-radio :md-value="aggregation" name="map_aggregation" v-model="map_aggregation"></md-radio>
          </md-list-item>

          <md-list-item v-else>No aggregations</md-list-item>
        </md-list>

      </md-card-content>

      <md-card-header>
        <div class="md-title">Select aggregations for use on monitor table</div>
      </md-card-header>
      <md-card-content>

        <md-list>
          <md-list-item v-if="aggregation_name_array" v-for="aggregation in aggregation_name_array" :key="aggregation">
            <span>{{aggregation}}</span>
            <md-checkbox :md-value="aggregation" name="map_aggregation" v-model="table_aggregations[aggregation]"></md-checkbox>
          </md-list-item>

          <md-list-item v-else>No aggregations</md-list-item>
        </md-list>

      </md-card-content>
      <md-card-actions>
        <md-button @click.native="save_and_continue">Save</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import clone_deep from 'lodash.clonedeep'

  export default {
    name: 'configure_presenters',
    data () {
      return {
        show_aggregations_for_table: false,

        table_aggregations: {},
        map_aggregation: ''
      }
    },
    computed: {
      ...mapState({
        aggregations: state => state.data_wizard.aggregations,
        applets: state => state.data_wizard.instance_config.applets
      }),
      aggregation_name_array() {
        return this.aggregations ? Object.keys(this.aggregations) : []
      }
    },
    mounted() {
      this.map_aggregation = this.aggregations[0]
    },
    methods: {
      save_and_continue() {
        const clone = clone_deep(this.applets)

        clone.irs_monitor.aggregations = {
          map: this.map_aggregation,
          table: Object.keys(this.table_aggregations)
        }
        this.$store.commit('data_wizard/set_applets', clone)

      }
    }
  };
</script>

<style lang="css" scoped>
  .card {
    margin: 1em auto;
  }
</style>
