<template>
  <div>
    <h1>Filters</h1>
    <md-button @click.native="filter_for_week('all')">All</md-button>
    <md-button v-for="week in [18, 19, 20, 21, 22]" :key="week" @click.native="filter_for_week(week)">Week {{week}}
    </md-button>
  </div>
</template>

<script>
  export default {
    name: 'Filters',
    data () {
      return {
      }
    },
    methods: {
      filter_for_week(week) {
        this.$emit('filter', {type: 'week', value: week})
      },
    }
  }
</script>

<style lang="css" scoped>
</style>
