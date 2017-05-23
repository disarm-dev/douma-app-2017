<template>
  <v-client-table v-if='loaded' :data="tableData" :columns="columns"></v-client-table>
</template>
<script>
  import {ClientTable} from 'vue-tables-2';
  
  import NamAggregations from '@/lib/aggregations/nam.aggregations.js'

  export default {
    components: {ClientTable},
    data() {
      return {
        loaded: false,
        tableData: null
      }
    },
    mounted() {
      this.tableData = new NamAggregations({})
      this.columns = Object.keys(this.tableData[0])
      this.loaded = true
    }
  }
</script>
