<template>
  <div>
    <h2>Temporal filter</h2>
    <div class="date-input">
      <b>From</b>
      <date-picker :value="temporal.start" @selected="set_start_date"></date-picker>
    </div>

    <div class="date-input">
      <b>To</b>
      <date-picker :value="temporal.end" @selected="set_end_date"></date-picker>
    </div>
  </div>
</template>

<script>
export default {
  name: 'temporal',
  data () {
    return {
      start: new Date(),
      end: new Date(),
    }
  },
  computed: {
    temporal: {
      get() {
        return this.$store.state.irs_monitor.filters.temporal
      },
      set(value) {
        this.$store.commit('irs_monitor/set_filter', {
          path: 'temporal', 
          value: value
        })
      }
    }
  },
  methods: {
    set_start_date(start_date) {
      this.start = start_date
    },
    set_end_date(end_date) {
      this.end = end_date
    }
  }
};
</script>

<style lang="css" scoped>
</style>