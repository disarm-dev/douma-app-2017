<template>
  <div class="applet_container">
    <md-card class="card">
      <md-card-header>
        <div class="md-title">Create aggregations</div>
      </md-card-header>
      <md-card-content>
        
        <md-input-container >
          <label>Please enter the aggregations</label>
          <md-textarea v-model="aggregations"></md-textarea>
        </md-input-container>

      </md-card-content>
      <md-card-actions>
        <md-button @click.native="save_aggregations">Continue</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'create_aggregations',
  data () {
    return {
      aggregations: ''
    }
  },
  methods: {
    save_aggregations() {
      console.log(this.aggregations)
      this.$store.commit('data_wizard/set_aggregations', this.aggregations)
      this.$router.push({name: 'data_wizard:applets'})
    }
  }
};
</script>

<style lang="css" scoped>
  .card {
    margin: 1em auto;
  }
</style>