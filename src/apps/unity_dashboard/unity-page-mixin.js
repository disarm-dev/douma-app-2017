export default {
  mounted() {
    // TODO: @unity .get_configuration(id) should return config for a specific page
    this.configuration = this.$unity.getConfiguration(this.dashboard_id) // handle errors
    this.$unity.registerInterest(this.dashboard_id) // TODO: @unity .register_interest() tells unity which pipelines it should rerun?
  },
  beforeDestroy() {
    this.$unity.unregisterInterest(this.dashboard_id) // TODO: @unity .unregister_interest()
  }
}