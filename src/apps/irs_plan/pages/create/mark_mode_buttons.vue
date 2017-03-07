<template>
  <div>
    <md-button @click.native='set_mark_mode("add")' :disabled='is_disabled("add")'>mark to add</md-button>
    <md-button @click.native='set_mark_mode("remove")' :disabled='is_disabled("remove")'>mark to remove</md-button>
  </div>
</template>

<script>
  export default {
    named: 'MarkModeButtons',
    methods: {
      is_disabled(mark_mode) {
        if (this.$store.state.irs_plan.mark_mode && this.$store.state.irs_plan.mark_mode !== mark_mode) return true
        return false
      },
      set_mark_mode(mark_mode) {
        if (this.$store.state.irs_plan.mark_mode === mark_mode) mark_mode = null
        this.$store.commit('irs_plan:set_mark_mode', mark_mode)
      }
    }
  }
</script>

<style>
</style>