<template>
  <div>
    <h3>Selected regions:</h3>
    <md-button class='md-raised md-warn' @click.native="clear_plan">Clear plan</md-button>
    <md-button class='md-raised md-primary' @click.native="download_plan">Download plan</md-button>
    <p>Working with {{selected_target_area_ids.length}} regions, containing in total XX structures, YY rooms, ZZ population</p>
    <v-client-table
      v-if="table.data.length > 0"
      :data="table.data"
      :columns="table.columns"
    ></v-client-table>
  </div>

</template>

<script>
  export default {
    name: 'plan_summary',
    computed: {
      selected_target_area_ids() {
        return this.$store.state.irs_plan.selected_target_area_ids
      },
      selected_regions() {
        return this.$store.state.irs_plan.selected_target_area_ids.map(id => {
          // return this.regions.find(feature => feature.properties.id === id)
        })
      },
      table() {
        const data = this.selected_regions.map(r => r.properties)
        const columns = Object.keys(data[0])
        return {data, columns}
      },
    }
  }
</script>

<style></style>
