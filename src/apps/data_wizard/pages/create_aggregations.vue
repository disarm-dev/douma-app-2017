<template>
  <div class="applet_container">
    <md-card class="card">
      <md-card-header>
        <div class="md-title">Create aggregations</div>
      </md-card-header>
      <md-card-content>
        Create aggregations
      </md-card-content>
      <md-card-actions>
        <md-button @click.native="$router.push({name: 'data_wizard:applets'})">Continue</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'create_aggregations',
  data () {
    return {

    }
  }
};
</script>

<style lang="css" scoped>
  .card {
    margin: 1em auto;
  }
</style>