<template>
  <div class="applet_container">
    <md-card class="card">
      <md-card-header>
        <div class="md-title">Configure applets</div>
      </md-card-header>
      <md-card-content>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel inventore cum, nihil libero temporibus praesentium, laudantium modi odit veritatis consequatur. Voluptatem ad aspernatur iure obcaecati, repellat. Eligendi at, nesciunt impedit.
      </md-card-content>
      <md-card-actions>
        <md-button @click.native="$router.push({name: 'data_wizard:presenters'})">Continue</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'configure_applets',
  data () {
    return {

    };
  }
};
</script>

<style lang="css" scoped>
.card {
  margin: 1em auto;
}
</style>