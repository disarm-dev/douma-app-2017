<template>
  <div>
    <md-checkbox :disabled="disabled" v-model="limit_to_plan">Limit responses to plan</md-checkbox>
  </div>
</template>

<script>
  import {get} from 'lodash'

  import CONFIG from 'config/common'

  export default {
    name: 'limit-to',
    props: ['responses', 'targets', 'selected_limit'],
    computed: {
      disabled() {
        if (!this.targets) return true
        return this.targets.length === 0
      },
      limit_to_plan: {
        get() {
          return this.$store.state.irs_monitor.dashboard_options.limit_to_plan
        },
        set(val) {
          const options = {
            ...this.$store.state.irs_monitor.dashboard_options,
            limit_to_plan: val
          }
          this.$store.commit('irs_monitor/set_dashboard_options', options)
        }
      }
    }
  }

</script>

<style scoped>

</style>