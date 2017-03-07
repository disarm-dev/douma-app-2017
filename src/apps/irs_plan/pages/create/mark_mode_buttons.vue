<template>
  <div>
    <md-button 
      @click.native='set_map_mark_mode("add")' 
      :class="{active: is_active('add')}">
      add
    </md-button>
    <md-button 
      @click.native='set_map_mark_mode("remove")' 
      :class="{active: is_active('remove')}">
      remove
    </md-button>
  </div>
</template>

<script>
  export default {
    named: 'MarkModeButtons',
    computed: {
      current_mode() {
        return this.$store.state.irs_plan.map_mark_mode
      }
    },
    methods: {
      is_active(map_mark_mode) {
        return this.current_mode === map_mark_mode
      },
      set_map_mark_mode(map_mark_mode) {
        if (this.current_mode === map_mark_mode) map_mark_mode = null
        this.$store.commit('irs_plan:set_map_mark_mode', map_mark_mode)
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