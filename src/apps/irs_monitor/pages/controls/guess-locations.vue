<template>
  <div>
    <!--DOWNLOAD BUTTON -->
    <md-button
      @click.native="$store.dispatch('irs_record_point/guess_response_locations',responses)"
      class="md-dense list-button md-raised md-primary"
    >
      Guess locations
    </md-button>
  </div>
</template>

<script>
  export default {
    name: "guess-locations",
    props: ['responses'],
    computed: {
      disabled() {
        return false
      },
      guess_selection_ids: {
        get() {
          return this.$store.state.irs_monitor.dashboard_options.guess_selection_ids
        },
        set(val) {
          const options = {
            ...this.$store.state.irs_monitor.dashboard_options,
            guess_selection_ids: val
          }
          console.log('guess_selection_id',val)
          this.$store.commit('irs_monitor/set_dashboard_options', options)
        }
      },

      guessed_responses() {
        return this.$store.state.irs_record_point.guessed_responses
      },
      not_in_village() {
        return this.$store.state.irs_record_point.responses_not_in_village
      }
    }
  }
</script>

<style scoped>

</style>
