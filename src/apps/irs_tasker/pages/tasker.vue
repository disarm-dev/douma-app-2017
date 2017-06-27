<template>
  <div class="container">
    <h1>Assign teams</h1>

    <tasker_legend :decorated_teams="decorated_teams" :selected_team_name="selected_team_name" @selected_team="select_team"></tasker_legend>

    <div id="map"></div>

    <team_list :decorated_teams="decorated_teams"></team_list>

  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import bbox from '@turf/bbox'
  import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw'
  import intersect from '@turf/intersect'
  import {featureCollection} from '@turf/helpers'
  import chroma from 'chroma-js'
  import array_unique from 'array-unique'
  import {get_geodata_area, get_current_plan} from 'lib/data/remote'
  import {basic_map} from 'lib/basic_map.js'
  import team_list from './team_list'
  import tasker_legend from './legend'

  const PALETTE = chroma.brewer.Set3

  const UNASSIGNED_TEAM = {
    team_name: 'Unassigned',
    colour: 'grey',
    count: 0
  }

  export default {
    components: {team_list, tasker_legend},
    data() {
      return {
        _geodata_areas: null,
        target_areas: null,
        selected_team_name: '',
        click_handler: null,
      }
    },
    watch: {
      '$store.state.irs_tasker.assignments': 'draw_areas'
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        assignments: state => state.irs_tasker.assignments,
        id_field: state => state.instance_config.spatial_hierarchy.find((sp) => sp.hasOwnProperty('denominator')).field_name ,
      }),
      decorated_teams() {
        const unassigned_count = this.assignments.filter(a => a.team_name === null).length

        const teams = this.$store.state.irs_tasker.teams.map((team_name, index) => {
          return {
            team_name,
            colour: PALETTE[index],
            count: this.assignments.filter(a => a.team_name === team_name).length
          }
        }).concat({...UNASSIGNED_TEAM, count: unassigned_count})

        return teams
      }
    },
    mounted() {
      this.create_map()
      this.selected_team_name = this.$store.state.irs_tasker.teams[0]
    },
    methods: {
      select_team(team_name) {
        this.selected_team_name = team_name
      },
      teams_with_count() {
        let teams = this.teams
        this.target_areas.features.forEach((feature) => {
          let team = teams.find(_team => {
            return _team.name === feature.properties.team_name
          })

          if (team) {
            if (team.count) {
              team.count += 1
            } else {
              team.count = 1
            }
          }
        })

        return teams
      },
      assign_area_to_team(area_id) {
        this.$store.dispatch('irs_tasker/assign_area_to_team', {area_id, team_name: this.selected_team_name})        
      },
      create_map() {
        this._map = basic_map(this.$store)

        this._map.on('load', () => {
          Promise.all([this.load_geodata(), this.load_current_plan()]).then((areas) => {
            const geo_data = areas[0]
            const plan = areas[1]

            let planned_areas = array_unique(plan.targets.map(({id}) => {
              return geo_data.features.find((feature) => {
                return feature.properties[this.id_field] === id
              })
            }))

            planned_areas = planned_areas.map((area) => {
              area.properties.team_name = UNASSIGNED_TEAM.team_name
              return area
            })

            this.target_areas = featureCollection(planned_areas)

            this.draw_areas()
            this.bind_click_handler()
            this.add_draw_controls()
          })
        })
      },
      load_current_plan() {
        // TODO: @feature handle failure
        return get_current_plan(this.instance_config.slug)
      },
      load_geodata() {
        // take the first spatial_hierarchy
        const area_type = this.instance_config.spatial_hierarchy[0].name

        // TODO: @feature handle failure
        return get_geodata_area({slug: this.instance_config.slug, level: area_type})

      },
      draw_areas(areas) {
        if (this._map.getLayer('areas')) {
          this._map.removeLayer('areas')
        }

        if (this._map.getSource('areas')) {
          this._map.removeSource('areas')
        }
        const palette = this.decorated_teams.map(({team_name, colour}) => {
          return [team_name, colour]
        })

        this._map.addLayer({
          id: 'areas',
          type: 'fill',
          source: {
            type: 'geojson',
            data: this.target_areas
          },
          paint: {
            'fill-color': 'green',
            'fill-color': {
              type: 'categorical',
              property: 'team_name',
              stops: palette
            },
            'fill-opacity': 0.9,
            'fill-outline-color': '#262626'
          }
        })

        this._map.fitBounds(bbox(this.target_areas), {padding: 20});
      },

      // Click listeners
      bind_click_handler() {
        this.click_handler = (e) => {
          const clicked_feature = this._map.queryRenderedFeatures(e.point)[0]

          // Update the map
          let index = this.target_areas.features.findIndex((feature) => feature.properties[this.id_field] === clicked_feature.properties[this.id_field])
          this.target_areas.features[index].properties.team_name = this.selected_team_name
          this._map.getSource('areas').setData(this.target_areas)

          // Update store
          this.assign_area_to_team(clicked_feature.properties[this.id_field])
        }
        this._map.on('click', 'areas', this.click_handler)
      },
      remove_click_handler() {
        this._map.off('click', 'areas', this.click_handler)
        this.click_handler = null
      },

      // Draw controls
      add_draw_controls () {
        if (this._map) {
          const options = {
            boxSelect: false,
            keyBindings: false,
            displayControlsDefault: false,
            controls: {
              polygon: true
            }
          }
          this.draw = new MapboxDraw(options)

          this._map.on('draw.create', (e) => {
            let drawn_polygon = e.features[0]

            let polygons = this.target_areas.features
            let selected_area_indicies = []
            polygons.forEach((polygon, index) => {
              if (intersect(drawn_polygon, polygon)) {
                  selected_area_indicies.push(index)
                  this.assign_area_to_team(polygon.properties[this.id_field])
              }
            })

            selected_area_indicies.forEach((index) => {
              this.target_areas.features[index].properties.team_name = this.selected_team_name
            })

            this._map.getSource('areas').setData(this.target_areas)
            this.draw.deleteAll()

            setTimeout(() => {
              this.bind_click_handler()
            }, 200)
          })

          this._map.on('draw.modechange', (e) => {
            if(e.mode === 'draw_polygon') this.remove_click_handler()
          })

          this._map.addControl(this.draw)
        }
      },
      remove_draw_controls () {
        if (this.draw) {
          this._map.removeControl(this.draw)
          this.draw = null
        }
      }
    }
  }
</script>
<style scoped>
  #map {
    height: 500px
  }


</style>
