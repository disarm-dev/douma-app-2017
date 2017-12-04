export default {
  mounted() {
    this.configuration = this.$unity.getConfiguration(this.dashboard_id) // handle errors
    this.$unity.registerInterest(this.dashboard_id)
  },
  beforeDestroy() {
    this.$unity.unregisterInterest(this.dashboard_id)``
  }
}