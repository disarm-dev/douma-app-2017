<template>
  <div>
    <h4>Select area to focus plan on</h4>
    <p>With an area selected, you won't be able to edit or save anywhere else.</p>
    <multiselect
      :disabled="unsaved_changes"
      class="filter_select"
      :value="selected_filter_area_option"
      @select="select_filter"
      :options="filter_options"
      placeholder="Select area to limit plan "
      track-by="id"
      label="name"
      :internal-search="true"
    >
      <span slot="noResult">Nothing found.</span>
    </multiselect>
  </div>

</template>

<script>
  import {mapState} from 'vuex'
  import Multiselect from 'vue-multiselect'

  import cache from 'config/cache'
  import {get_next_level_up_from_planning_level} from 'lib/spatial_hierarchy_helper'

  export default {
    name: 'plan-filter',
    components: {Multiselect},
    props: ['unsaved_changes'],
    mounted() {
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        geodata_ready: state => state.geodata_ready,
        selected_filter_area_option: state => state.irs_plan.selected_filter_area_option
      }),
      filter_options() {
        const next_level_up_from_planning_level = get_next_level_up_from_planning_level()

        return cache.geodata[next_level_up_from_planning_level.name].features.map(feature => {
          const id = feature.properties[next_level_up_from_planning_level.field_name]
          const name = feature.properties[next_level_up_from_planning_level.display_field_name]
          return {id, name}
        })
      },
    },
    methods: {
      select_filter(filter_option) {
        this.$store.commit('irs_plan/set_selected_filter_area_option', filter_option)
      }
    }
  }
</script>

<style scoped>
  .filter_select {
    z-index: 2;
  }
</style>
