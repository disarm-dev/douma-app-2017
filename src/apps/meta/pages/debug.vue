<template>
  <div>
    <h2>Routes</h2>
    <ul>
      <li v-for='route in routes'>
        {{route}}
      </li>
    </ul>
  </div>
</template>

<script>
  import routeTable from "../../../lib/router-helper.js"

  export default {
    name: 'DEBUG',
    data () {
      return {
      }
    },
    computed: {
      routes() {
        return routeTable(this.$router)
      }
    }
  }
</script>

<style scoped>
</style>