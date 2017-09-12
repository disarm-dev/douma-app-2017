<template>
  <div>

    <md-radio
        name="limit_selection"
        :value='selected_limit'
        md-value="all"
        @change="select_limit">
      All
    </md-radio>

    <md-radio
        name="limit_selection"
        :value='selected_limit'
        md-value="responses"
        @change="select_limit"
        :disabled="responses_disabled">
      Responses
      <md-tooltip v-if="responses_disabled" md-direction="bottom">No responses loaded</md-tooltip>
    </md-radio>

    <md-radio
        name="limit_selection"
        :value='selected_limit' 
        md-value="plan"
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
        live: true
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
    methods: {
      select_limit(limit_type) {
        this.$emit('change', limit_type)
      }
    }
  }

</script>

<style scoped>

</style>