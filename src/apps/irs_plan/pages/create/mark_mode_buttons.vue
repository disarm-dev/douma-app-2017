<template>
  <div>
    <md-button 
      @click.native='set_mark_mode("add")' 
      :class="{active: is_active('add')}">
      add
    </md-button>
    <md-button 
      @click.native='set_mark_mode("subtract")' 
      :class="{active: is_active('subtract')}">
      subtract
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
      set_mark_mode(mark_mode) {
        if (this.current_mode === mark_mode) mark_mode = null
        this.$store.commit('irs_plan:set_mark_mode', mark_mode)
      }
    }
  }
</script>

<style scoped>
  .active {
    background: #92da92;
  }
  .active:hover:not([disabled]):not(.md-raised) {
    background: lightgreen;
  }
</style>