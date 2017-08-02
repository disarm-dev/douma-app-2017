<template>
  <div class="applet_container">
    <md-card class="card">
      <md-card-header>
        <div class="md-title">Create aggregations</div>
      </md-card-header>

      <md-card-content>
        <div>{{JSON.stringify(aggregations)}}</div>
      </md-card-content>

      <md-card-actions>
        <md-button @click.native="save_aggregations">Save</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'create_aggregations',
  data () {
    return {
      aggregations: {'sprayed': {numerator_expr: 'population'}}
    }
  },
  methods: {
    save_aggregations() {
      console.log(this.aggregations)
      this.$store.commit('data_wizard/set_aggregations', this.aggregations)
    }
  }
};
</script>

<style lang="css" scoped>
  .card {
    margin: 1em auto;
  }
</style>
