<template>
  <div>
    <h2>Spatial filter</h2>
    <div style="padding-left:1em">
      <multiselect
        placeholder="Select a spatial hierarchy to limit by"
        :options="spatial_hierarchy_options"
        :value="spatial.spatial_hierarchy"
        @select="select_spatial_level"
      ></multiselect>
      <br>
      <multiselect
        v-if="NO_SPATIAL_FILTER_OPTION !== spatial.spatial_hierarchy"
        :value="spatial.selected_filter_area_option"
        @select="select_area"
        :options="area_options"
        group-values="items"
        group-label="category"
        placeholder="Select area to limit responses"
        track-by="id"
        label="name"
        :internal-search="true"
      ></multiselect>
    </div>
  </div>

</template>

<script>
  import Multiselect from 'vue-multiselect'

  //import { mapState, mapActions, mapMutations } from 'vuex'

  const NO_SPATIAL_FILTER_OPTION = 'No spatial filter'

  export default {
    name: 'spatial-filter',
    mounted() {
    },
    data() {
      return {
        NO_SPATIAL_FILTER_OPTION,

        spatial: {
          selected_filter_area_option: '',
          spatial_hierarchy: ''
        },
      }
    },
    methods: {
      spatial_hierarchy_options() {
        return [NO_SPATIAL_FILTER_OPTION].concat(get_all_spatial_hierarchy_level_names())
      },
      area_options() {
        let planning_level
        if (get_next_level_up_from_planning_level()) {
          planning_level = get_next_level_up_from_planning_level()
        } else {
          planning_level = get_planning_level()
        }

        const categories = unique(sort(cache.geodata[planning_level.name].features.map(feature => {
          return feature.properties.category
        })))

        const result = categories.map(category => {
          const items = cache.geodata[planning_level.name].features.filter(feature => {
            return feature.properties.category === category
          }).map(feature => {
            const id = feature.properties[planning_level.field_name]
            const name = feature.properties[planning_level.display_field_name]
            return {id, name}
          })

          return {
            category: category,
            items: items
          }
        })

        return result
      },

    }
  }
</script>

<style scoped>

</style>
