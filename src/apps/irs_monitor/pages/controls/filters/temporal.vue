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

    <div class="date-input">
      <md-button @click="add_temporal_filter">Add filter</md-button>
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
  watch: {
    'responses': 'set_start_and_end_dates'
  },
  methods: {
    set_start_and_end_dates() {
      if (!this.responses || !this.responses.length) return

      const dates = this.responses.map(record => new Date(record.recorded_on).getTime())

      this.start = new Date(Math.min(...dates))
      this.end = new Date(Math.max(...dates))
    },
    add_temporal_filter() {
      if (!this.responses || !this.responses.length) return

      // emit start
      this.$emit('change', {
        name: 'recorded_on',
        comparator: '>',
        value: new Date(this.start).getTime()
      })

      //emit end
      this.$emit('change', {
        name: 'recorded_on',
        comparator: '<',
        value: new Date(this.end).getTime()
      })
    }
  }
};
</script>

<style lang="css" scoped>
  .date-input {
    display: inline-block;
  }
</style>