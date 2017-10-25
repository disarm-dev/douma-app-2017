<template>
    <div>
        <h2>Active filters</h2>
        <md-chip v-for="({name, comparator, value}, index) in formatted_filters" :key="index" md-deletable @delete="on_delete(index)">
            {{name}} {{comparator}} {{value}}
        </md-chip>
    </div>
</template>

<script>
  import moment from 'moment-mini'

  export default {
    name: 'filter-summary',
    props: ['filters'],
    computed: {
      formatted_filters() {
        return this.filters.map(f => {
          if (f.name === 'recorded_on') {
            f.value = moment(new Date(f.value)).format("MMM Do YYYY")
          }
          return f
        })
      }
    },
    methods: {
      on_delete(index) {
        this.$emit('remove_filter', this.filters[index])
      }
    }
  }
</script>

<style scoped>

</style>