<template>
  <div>
    <h2>Temporal filter</h2>
    <div class="date-input">
      <b>From</b>
      <date-picker v-model="start"></date-picker>
    </div>

    <div class="date-input">
      <b>To</b>
      <date-picker v-model="end"></date-picker>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vuejs-datepicker';

export default {
  name: 'temporal',
  props: ['responses'],
  components: {DatePicker},
  data () {
    return {
      start: null,
      end: null,
    }
  },
  created() {
    this.set_start_and_end_dates()
  },
  methods: {
    set_start_and_end_dates() {
      const dates = this.responses.map(record => record.recorded_on.getTime())

      this.start = new Date(Math.min(...dates))
      this.end = new Date(Math.max(...dates))
    },
    add_temporal_filter() {
      // emit start
      this.$emit('change', {
        filter_name: 'recorded_on',
        filter_comparator: '>',
        filter_value: this.start.getTime()
      })

      //emit end
      this.$emit('change', {
        filter_name: 'recorded_on',
        filter_comparator: '<',
        filter_value: this.end.getTime()
      })
    }
  }
};
</script>

<style lang="css" scoped>
</style>