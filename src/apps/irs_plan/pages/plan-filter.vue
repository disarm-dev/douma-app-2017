<template>
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

</template>

<script>
  import {mapState} from 'vuex'
  import Multiselect from 'vue-multiselect'

  import cache from 'config/cache'
  import {get_top_level_hierarchy} from 'lib/spatial_hierarchy_helper'

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
      top_level_hierarchy() {
        return get_top_level_hierarchy() // TODO: @refac to be more specific/targeted
      },
      filter_options() {
        return cache.geodata[this.top_level_hierarchy.name].features.map(feature => {
          const id = feature.properties[this.top_level_hierarchy.field_name]
          const name = feature.properties[this.top_level_hierarchy.display_field_name]
          return {id, name}
        })
      },
    },
    mounted() {
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
