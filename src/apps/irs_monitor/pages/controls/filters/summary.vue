<template>
    <div>
        <h2>Active filters</h2>
        <md-chip v-for="({name, comparator, value}, index) in filters" :key="index" md-deletable @delete="on_delete(filter)">
            {{name}} {{comparator}} {{value}}
        </md-chip>
    </div>
</template>

<script>
  export default {
    name: 'summary',
    props: ['filters'],
    methods: {
      on_delete(filter) {
        this.$emit('remove_filter', filter)
      }
    }
  }
</script>

<style scoped>

</style>