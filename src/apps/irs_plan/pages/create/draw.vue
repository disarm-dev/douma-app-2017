<template>
  <div>
    <md-button @click.native='add'>Add</md-button>
    <md-button @click.native='subtract'>Subtract</md-button>
  </div>
</template>

<script>
export default {

  name: 'Draw',

  data () {
    return {

    }
  },
  methods: {
    add() {
      this.$store.dispatch('irs_plan/informal_draw_add', {size: 1})
    },
    subtract() {
      this.$store.dispatch('irs_plan/informal_draw_subtract', {size: -1})
    }
  }
};
</script>

<style lang="css" scoped>
</style>