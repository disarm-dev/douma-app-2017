<template>
  <div>
    <h2>Aggregation settings</h2>
    <p @click="debug_change_option">Spatial aggregation level: 'consituencies' (planning level)</p>
    <p>Temporal aggregatation level: 'week'</p>
  </div>
</template>

<script>
  /**
   * Control various elements of the dashboard. Any settings here 
   */
  export default {
    name: 'aggregation-settings',
    mounted() {
    },
    data() {
      return {}
    },
    methods: {
      create_defaults() {
      },
      debug_change_option() {
        console.log('debug_change_option')
        this.$store.commit('irs_monitor/set_dashboard_options', {new_one: true})
      }
    }
  }
</script>

<style scoped>

</style>
