<template>
  <div>

    <md-radio
        ref="all"
        md-value="all"
        name="limit_selection"
        :value='local_selected_limit'
        @change="select_limit">
      All
    </md-radio>

    <md-radio
        ref="responses"
        md-value="responses"
        name="limit_selection"
        :value='local_selected_limit'
        @change="select_limit"
        :disabled="responses_disabled">
      Responses
      <md-tooltip v-if="responses_disabled" md-direction="bottom">No responses loaded</md-tooltip>
    </md-radio>

    <md-radio
        ref="plan"
        md-value="plan"
        name="limit_selection"
        :value='local_selected_limit'
        @change="select_limit"
        :disabled="targets_disabled">
      Plan
      <md-tooltip v-if="targets_disabled" md-direction="bottom">No plan loaded</md-tooltip>
    </md-radio>

  </div>
</template>

<script>

  export default {
    name: 'limit-to',
    props: ['responses', 'targets', 'selected_limit'],
    data() {
      return {
        local_selected_limit: 'all'
      }
    },
    computed: {
      responses_disabled() {
        if (!this.responses) return true
        return this.responses.length === 0
      },
      targets_disabled() {
        if (!this.targets) return true
        return this.targets.length === 0
      }
    },
    created() {
      if (this.selected_limit) this.local_selected_limit = this.selected_limit
    },
    methods: {
      select_limit(limit_type) {
        this.local_selected_limit = limit_type
        this.$emit('change', limit_type)
      }
    }
  }

</script>

<style scoped>

</style>