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
        :disabled="!responses.length">
      Responses
      <md-tooltip v-if="!responses.length" md-direction="bottom">No responses loaded</md-tooltip>
    </md-radio>

    <md-radio
        name="limit_selection"
        :value='selected_limit' 
        md-value="plan"
        @change="select_limit"
        :disabled="!targets.length">
      Plan
      <md-tooltip v-if="!targets.length" md-direction="bottom">No plan loaded</md-tooltip>
    </md-radio>

  </div>
</template>

<script>

  export default {
    name: 'limit-to',
    props: ['responses', 'targets', 'selected_limit'],
    methods: {
      select_limit(limit_type) {
        this.$emit('change', limit_type)
      }
    }
  }

</script>

<style scoped>

</style>