<template>
  <div>
    <md-table v-once>
      <md-table-header>
        <md-table-row>
          <md-table-head>Status</md-table-head>
          <md-table-head md-numeric>Investigated</md-table-head>
          <md-table-head md-numeric>Visual Review</md-table-head>
          <md-table-head md-numeric>Suggested</md-table-head>
          <md-table-head md-numeric>Total</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
      <md-table-row>
          <md-table-cell>Active</md-table-cell>
          <md-table-cell md-numeric>79</md-table-cell>
          <md-table-cell md-numeric>59</md-table-cell>
          <md-table-cell md-numeric>19</md-table-cell>
          <md-table-cell md-numeric>157</md-table-cell>
        </md-table-row>
        <md-table-row>
          <md-table-cell>Inactive</md-table-cell>
          <md-table-cell md-numeric>67</md-table-cell>
          <md-table-cell md-numeric>94</md-table-cell>
          <md-table-cell md-numeric>97</md-table-cell>
          <md-table-cell md-numeric>258</md-table-cell>
        </md-table-row>
        <md-table-row>
          <md-table-cell>Cleared</md-table-cell>
          <md-table-cell md-numeric>59</md-table-cell>
          <md-table-cell md-numeric>17</md-table-cell>
          <md-table-cell md-numeric>99</md-table-cell>
          <md-table-cell md-numeric>175</md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>
  </div>
</template>

<script>

  export default {
    name: 'FociSummaryTable',
    watch: {
    },
    created() {
    },
    data () {
      return {
        columns: ['_id', 'location']
      }
    },
    computed: {
      tableData() {
        return this.$store.state.foci.focis.map((foci) => foci.properties)
      }
    },
    methods: {

    }

  }
</script>