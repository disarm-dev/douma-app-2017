<template>
    <div>
        <h2>Active filters</h2>
        <md-chip v-for="({name, comparator, value}, index) in filters" :key="index">
            {{name}} {{comparator}} {{value}}
        </md-chip>
    </div>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex'

  export default {
    name: 'summary',
    data() {
      return {
        filters: [
          {name: 'name', comparator: 'eq', value: 'me'},
          {name: 'name2', comparator: 'eq', value: 'me2'}
        ]
      }
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style scoped>

</style>