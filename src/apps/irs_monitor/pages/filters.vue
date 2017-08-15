<template>
  <md-card class="card filter_select">
    
    <md-card-header>
      <div class="md-title" @click="show_filters = !show_filters">Filters</div>
    </md-card-header>

    <md-card-content v-show="show_filters">
      <div>
        <h2>Temporal filter</h2>
        <div class="date-input">
          <p><b>From</b></p>
          <date-picker :value="start_date" @selected="set_start_date"></date-picker>
        </div>

        <div class="date-input">
          <p><b>To</b></p>
          <date-picker :value="end_date" @selected="set_end_date"></date-picker>
        </div>
      </div>

      <div>
        <h2>Spatial filter</h2>
        <div style="padding-left:1em">
          <multiselect
            placeholder="Select a spatial hierarchy to limit by"
            :options="spatial_hierarchy_options"
            :value="planning_level_name"
          ></multiselect>
          <br>
          <multiselect 
            :value="selected_filter_area_option"
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
      
    </md-card-content>

  </md-card>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import DatePicker from 'vuejs-datepicker';
  import sort from 'alphanum-sort'
  import unique from 'array-unique'

  import cache from 'config/cache'
  import {get_next_level_up_from_planning_level, get_all_spatial_hierarchy_level_names, get_planning_level_name} from 'lib/geodata/spatial_hierarchy_helper'

  export default {
    name: 'Filters',
    components: {Multiselect, DatePicker},
    data () {
      return {
        show_filters: true,
        start_date: new Date(),
        end_date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        selected_spatial_hierarchy: '',
        selected_filter_area_option: '',
      }
    },
    computed: {
      planning_level_name() {
        return get_planning_level_name()
      },
      spatial_hierarchy_options() {
        return ['country'].concat(get_all_spatial_hierarchy_level_names())
      },
      area_options() {
        const next_level_up_from_planning_level = get_next_level_up_from_planning_level()

        const categories = unique(sort(cache.geodata[next_level_up_from_planning_level.name].features.map(feature => {
          return feature.properties.category
        })))

        const result = categories.map(category => {
          const items = cache.geodata[next_level_up_from_planning_level.name].features.filter(feature => {
            return feature.properties.category === category
          }).map(feature => {
            const id = feature.properties[next_level_up_from_planning_level.field_name]
            const name = feature.properties[next_level_up_from_planning_level.display_field_name]
            return {id, name}
          })

          return {
            category: category,
            items: items
          }
        })

        return result
      },
    },
    methods: {
      emit_filter() {
        const filter = {
          temporal: {
            start: this.start_date,
            end: this.end_date
          },
          spatial: {
            level: this.planning_level_name, // TODO: @feature Actually allow users to select this value,
            id: this.selected_filter_area_option.id,
            name: this.selected_filter_area_option.name
          }
        }
        this.$emit('filter', filter)
      },
      select_area(area) {
        this.selected_filter_area_option = area
        this.emit_filter()
      },
      set_start_date(start_date) {
        this.start_date = start_date
        this.emit_filter()
      },
      set_end_date(end_date) {
        this.end_date = end_date
        this.emit_filter()
      },
    }
  }
</script>

<style scoped>
  .date-input {
    display: inline-block;
    padding: 0 1em;
  }

  .filter_select {
    z-index: 4;
    overflow: visible;
    margin-bottom: 10px;
  }
</style>
