<template>
  <div>
    <md-button 
      @click.native='set_mark_mode("add")' 
      :disabled='is_disabled("add")'
      :class="{'md-primary': is_active('add')}">
      mark to add
    </md-button>
    <md-button 
      @click.native='set_mark_mode("remove")' 
      :disabled='is_disabled("remove")'
      :class="{'md-primary': is_active('remove')}">
      mark to remove
    </md-button>
  </div>
</template>

<script>
  export default {
    named: 'MarkModeButtons',
    computed: {
      current_mode() {
        return this.$store.state.irs_plan.mark_mode
      }
    },
    methods: {
      is_active(mark_mode) {
        return this.current_mode === mark_mode
      },
      is_disabled(mark_mode) {
        if (this.current_mode && this.current_mode !== mark_mode) return true
        return false
      },
      set_mark_mode(mark_mode) {
        if (this.current_mode === mark_mode) mark_mode = null
        this.$store.commit('irs_plan:set_mark_mode', mark_mode)
      }
    }
  }
</script>

<style>
</style>