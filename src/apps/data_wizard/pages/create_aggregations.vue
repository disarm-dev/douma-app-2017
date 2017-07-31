<template>
  <div class="applet_container">
    <md-card class="card">
      <md-card-header>
        <div class="md-title">Create aggregation</div>
      </md-card-header>
      <md-card-content>
        
        <md-input-container >
          <label>Name</label>
          <md-textarea :disabled="true" v-model="aggregation_name"></md-textarea>
        </md-input-container>

        <md-input-container >
          <label>Aggregations expression</label>
          <md-textarea v-model="aggregation_expr"></md-textarea>
        </md-input-container>

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
      aggregation_name: 'Structures sprayed',
      aggregation_expr: ''
    }
  },
  methods: {
    save_aggregations() {
      let aggregations = {}
      aggregations[this.aggregation_name] = this.aggregation_expr
      
      this.$store.commit('data_wizard/set_aggregations', aggregations)
    }
  }
};
</script>

<style lang="css" scoped>
  .card {
    margin: 1em auto;
  }
</style>