<template>
  <div class="applet_container">
    <md-card class="card">
      <md-card-header>
        <div class="md-title">DiSARM Data Wizard</div>
      </md-card-header>
      <md-card-content>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo, sunt, nihil? Id at fugit, sit ex impedit, libero minus ratione, quis temporibus sed molestiae hic animi iusto reprehenderit non tempore.
      </md-card-content>
      <md-card-actions>
        <md-button @click.native="$router.push({name: 'data_wizard:configure_geodata'})">Start</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>

  export default {
    name: 'wizard'
  }
</script>

<style scoped>
  .card {
    margin: 1em auto;
  }
</style>
