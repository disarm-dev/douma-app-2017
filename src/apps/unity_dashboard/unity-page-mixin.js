export default {
  mounted() {
    // TODO: @unity .get_configuration(id) should return config for a specific page
    this.configuration = this.$unity.getConfiguration(this.dashboard_id) // handle errors
  }
}