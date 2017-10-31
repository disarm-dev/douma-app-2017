<template>
    <div>
        <h2>Active filters</h2>
        <md-chip v-for="({name, comparator, value}, index) in formatted_filters" :key="index" md-deletable @delete="on_delete(filters[index])">
            {{name}} {{comparator}} {{value}}
        </md-chip>
    </div>
</template>

<script>
  export default {
    name: 'filter-summary',
    props: ['filters'],
    computed: {
      formatted_filters() {
        return this.filters.map(f => {
          if (f.hasOwnProperty('display_value')) {
            f.value = f.display_value
          }

          if (f.hasOwnProperty('display_name')) {
            f.name = f.display_name
          }

          return f
        })
      }
    },
    methods: {
      on_delete(filter) {
        this.$emit('remove_filter', filter)
      }
    }
  }
</script>

<style scoped>

</style>