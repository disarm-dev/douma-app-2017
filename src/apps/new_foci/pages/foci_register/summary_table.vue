<template>
  <div class="summary-table">
    <p>Total number of Foci: {{total_foci}}</p>
    <md-table>
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
          <md-table-cell md-numeric>{{value(79)}}</md-table-cell>
          <md-table-cell md-numeric>{{value(59)}}</md-table-cell>
          <md-table-cell md-numeric>{{value(19)}}</md-table-cell>
          <md-table-cell md-numeric>{{value(157)}}</md-table-cell>
        </md-table-row>
        <md-table-row>
          <md-table-cell>Inactive</md-table-cell>
          <md-table-cell md-numeric>{{value(67)}}</md-table-cell>
          <md-table-cell md-numeric>{{value(94)}}</md-table-cell>
          <md-table-cell md-numeric>{{value(97)}}</md-table-cell>
          <md-table-cell md-numeric>{{value(258)}}</md-table-cell>
        </md-table-row>
        <md-table-row>
          <md-table-cell>Cleared</md-table-cell>
          <md-table-cell md-numeric>{{value(59)}}</md-table-cell>
          <md-table-cell md-numeric>{{value(17)}}</md-table-cell>
          <md-table-cell md-numeric>{{value(99)}}</md-table-cell>
          <md-table-cell md-numeric>{{value(175)}}</md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>

    <md-button class="md-accent md-raised" @click.native="vp = !vp">Toggle</md-button>

  </div>
</template>

<script>

  export default {
    name: 'FociSummaryTable',
    data () {
      return {
        //view percentages
        total_foci: 590,
        vp: false
      }
    },
    computed: {
      tableData() {
        return this.$store.state.foci.focis.map((foci) => foci.properties)
      }
    },
    methods: {
      value(v) {
        if (this.vp) {
          let num = v / this.total_foci * 100
          return Math.round(num * 10) / 10 + '%' 
        }

        return v
      }
    }
  }
</script>

<style>
  .summary-table {
    max-width: 800px;
    margin: 1em auto;
  }
</style>