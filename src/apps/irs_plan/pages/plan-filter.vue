<template>
  <div>
    <h4>Select area to focus plan on</h4>
    <p>With an area selected, you won't be able to edit or save anywhere else.</p>
    <multiselect
      v-if="geodata_ready"
      class="filter_select"
      v-model="filtered_area_id"
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
    mounted() {
    },
    data() {
      return {
        filtered_area_id: '',
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        geodata_ready: state => state.geodata_ready
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
        this.$emit('filter_selected', filter_option)
      }
    }
  }
</script>

<style scoped>
  .filter_select {
    z-index: 2;
  }
</style>
