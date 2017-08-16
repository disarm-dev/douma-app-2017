<template>
  <md-card class="card filter_select">
    
    <md-card-header>
      <div class="md-title" @click="show_filters = !show_filters">Filters</div>
    </md-card-header>

    <md-card-content v-show="show_filters">
      <div>
        <h2>Team filter</h2>
        <div style="padding-left:1em">
          <multiselect
            placeholder="Select a team to limit by"
            :options="team_options"
            :value="team"
            @select="select_team"
          ></multiselect>
        </div>
      </div>

      <div>
        <h2>Temporal filter</h2>
        <div class="date-input">
          <p><b>From</b></p>
          <date-picker :value="temporal.start" @selected="set_start_date"></date-picker>
        </div>

        <div class="date-input">
          <p><b>To</b></p>
          <date-picker :value="temporal.end" @selected="set_end_date"></date-picker>
        </div>
      </div>

      <div>
        <h2>Spatial filter</h2>
        <div style="padding-left:1em">
          <multiselect
            placeholder="Select a spatial hierarchy to limit by"
            :options="spatial_hierarchy_options"
            :value="planning_level_name"
            @select="select_spatial_level"
          ></multiselect>
          <br>
          <multiselect 
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
      
    </md-card-content>

  </md-card>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import DatePicker from 'vuejs-datepicker';
  import sort from 'alphanum-sort'
  import unique from 'array-unique'
  import {mapState} from 'vuex'

  import cache from 'config/cache'
  import {get_next_level_up_from_planning_level, get_all_spatial_hierarchy_level_names, get_planning_level_name, get_planning_level} from 'lib/geodata/spatial_hierarchy_helper'

  export default {
    name: 'Filters',
    components: {Multiselect, DatePicker},
    data () {
      return {
        // Meta
        show_filters: true,
        
        // Filter results
        team: '',
        temporal: {
          start: new Date(),
          end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        },
        spatial: {
          selected_filter_area_option: ''
        },
        
        // Config
        team_options: ['none', 'Team A', 'Team B', 'Team C', 'Team D', 'Team E']
      }
    },
    computed: {
      ...mapState({
        filter: state => state.irs_monitor.filter
      }),
      planning_level_name() {
        return get_planning_level_name()
      },
      spatial_hierarchy_options() {
        return ['country'].concat(get_all_spatial_hierarchy_level_names())
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
    },
    mounted() {
      if (this.filter) {
        this.temporal = this.filter.temporal
        this.spatial.selected_filter_area_option = this.filter.spatial
        this.team = this.filter.team
      }
    },
    methods: {
      emit_filter() {
        let filter = {
          temporal: {
            start: this.temporal.start,
            end: this.temporal.end
          }
        }

        if (this.planning_level_name !== 'country' && this.spatial.selected_filter_area_option && this.spatial.selected_filter_area_option.hasOwnProperty('id')) {
          filter.spatial = {
            level: this.planning_level_name, // TODO: @feature Actually allow users to select this value,
            id: this.spatial.selected_filter_area_option.id,
            name: this.spatial.selected_filter_area_option.name
          }
        }

        if (this.team !== 'none') {
          filter.team = this.team
        }

        this.$store.commit('irs_monitor/set_filter', filter)
      },
      select_team(team) {
        this.team = team
        this.emit_filter()
      },
      select_spatial_level() {
        this.emit_filter()
      },
      select_area(area) {
        this.spatial.selected_filter_area_option = area
        this.emit_filter()
      },
      set_start_date(start_date) {
        this.temporal.start = start_date
        this.emit_filter()
      },
      set_end_date(end_date) {
        this.temporal.end = end_date
        this.emit_filter()
      }
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
