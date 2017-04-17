<template>
  <div>
    <v-client-table class="list-table" :data="tableData" :columns="columns" name="focis" @row-click="handleClick"></v-client-table>
    <md-button @click.native='download_foci_table'>download CSV</md-button>
  </div>
</template>

<script>
  import download from 'downloadjs'
  import {Event} from 'vue-tables-2'

  export default {
    name: 'FociSummaryTable',
    watch: {
    },
    created() {
    },
    mounted() {
      let _this = this
      Event.$on('vue-tables.row-click', (data) => {
        _this.handleClick(data)
      });
    },
    data () {
      return {
        columns: ['_id', 'location', 'structures', 'cases', 'status']
      }
    },
    computed: {
      tableData() {
        return this.$store.state.foci.focis.map((foci) => foci.properties)
      }
    },
    methods: {
      handleClick({event, row}) {
        this.$router.push({name: 'foci:investigation', params: {foci_id: row._id}})
      },
      download_foci_table() {
        let csv_output = "_id,location,structures,cases,status\n"
        this.tableData.forEach((line, index) => {
          csv_output += `${line._id},${line.location},${line.structures},${line.cases},${line.status}\n`
        })
        download(csv_output, 'foci.csv', 'text/csv')
      }
    }

  }
</script>
<style scoped>
  .list-table {
    margin: 1em;
    margin-right: 1em !important;
  }

  .list-table thead th {
    
  }

  .list-table tbody td {

  }
</style>