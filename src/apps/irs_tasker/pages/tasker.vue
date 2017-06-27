<template>
  <div class="container">
    <h1>Assign teams</h1>

  <!--   <md-input-container>
      <label for="team">Team</label>
      <md-select name="team" v-model="selected_team">
        <md-option v-for="team in teams" :key="team.id" :value="team.id">
          {{team.name}}
        </md-option>
    </md-select>
  </md-input-container> -->
    <div>
        <div v-for="{name, colour} in teams" class="legend" :class="{'selected': selected_team.name === name}" @click="selected_team = {name, colour}">
          <div class="legend-box" :style="{'background-color': colour}"></div>
          <div class="legend-name">{{name}}</div>
        </div>
        <div class="legend" :class="{'selected': selected_team.name === 'Unassigned'}" @click="selected_team = {name: 'Unassigned', colour: 'grey'}">
          <div class="legend-box" style="background-color: grey"></div>
          <div class="legend-name">Unassigned</div>
        </div>
    </div>

    <div id="map"></div>

    

    <div style="margin-top:1em;">
      <tasker_list :teams="teams"></tasker_list>
    </div>

  </div>
</template>
<script> 
  import {mapState} from 'vuex'
  import bbox from '@turf/bbox'
  import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw'
  import intersect from '@turf/intersect'
  import chroma from 'chroma-js'
  import {get_geodata_area} from 'lib/data/remote'
  import {basic_map} from 'lib/basic_map.js'
  import tasker_list from './tasker_list'

  export default {
    components: {tasker_list},
    data() {
      return {
        _teams: [],
        geodata_areas: null,
        selected_team: '',
        click_handler: null,
        teams_with_count: []
      }
    },
    watch: {
      '$store.state.irs_tasker.teams': 'draw_areas'
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        id_field: state => state.instance_config.spatial_hierarchy.find((sp) => sp.hasOwnProperty('denominator')).field_name ,
      }),
      teams() {
        return this.$store.state.irs_tasker.teams.map((team, index) => {
          team.colour = chroma.brewer.Set3[index]
          return team
        })
      },
      palette() {
        let teams = this.teams.map((team) => {
          return [team.name, team.colour]
        })
        teams.push(['Unassigned', 'grey'])
        return teams
      },
      
    },
    created() {
      this.selected_team = this.teams[0]
    },
    mounted() {
      this.create_map()
    },
    methods: {
      teams_with_count() {
        let teams = this.teams
        this.geodata_areas.features.forEach((feature) => {
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
      create_map() {
        this._map = basic_map(this.$store)

        this._map.on('load', () => {
          this.load_geodata().then(() => {
            this.geodata_areas.features = this.geodata_areas.features.map((feature) => {
              feature.properties.team_name = 'Unassigned'
              return feature
            })

            this.draw_areas()
            this.bind_click_handler()
            this.add_draw_controls()
          })
        })
      },
      load_geodata() {
        // take the first spatial_hierarchy
        const area_type = this.instance_config.spatial_hierarchy[0].name

        return get_geodata_area({slug: this.instance_config.slug, level: area_type})
          .then((areas) => {
            this.geodata_areas = areas
            return Promise.resolve()
          })
          .catch((e) => console.log(e))

      },
      draw_areas(areas) {
        if (this._map.getLayer('areas')) {
          this._map.removeLayer('areas')
        }

        if (this._map.getSource('areas')) {
          this._map.removeSource('areas')
        }
        console.log(this.palette)
        this._map.addLayer({
          id: 'areas',
          type: 'fill',
          source: {
            type: 'geojson',
            data: this.geodata_areas
          },
          paint: {
            'fill-color': 'green',
            'fill-color': {
              type: 'categorical',
              property: 'team_name',
              stops: this.palette
            },
            'fill-opacity': 0.9,
            'fill-outline-color': '#262626'
          }
        })

        this._map.fitBounds(bbox(this.geodata_areas), {padding: 20});
      },

      // Click listeners
      bind_click_handler() {
        this.click_handler = (e) => {
          const clicked_feature = this._map.queryRenderedFeatures(e.point)[0]

          let index = this.geodata_areas.features.findIndex((feature) => feature.properties[this.id_field] === clicked_feature.properties[this.id_field])

          // This seems like a good way to handle updating the map
          this.geodata_areas.features[index].properties.team_name = this.selected_team.name
          
          this._map.getSource('areas').setData(this.geodata_areas)         
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

            let polygons = this.geodata_areas.features
            let selected_area_indicies = []
            polygons.forEach((polygon, index) => {
              if (intersect(drawn_polygon, polygon)) {
                  selected_area_indicies.push(index)
              }
            })

            selected_area_indicies.forEach((index) => {
              this.geodata_areas.features[index].properties.team_name = this.selected_team.name
            })

            this._map.getSource('areas').setData(this.geodata_areas)  
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

  .selected {
    background-color: rgba(0,0,0,0.3);
  }

  .legend {
    cursor: pointer;
    padding:1px 6px;
    display: inline-block;
    margin-right: 30px;
  }

  .legend-box {
    width: 10px;
    height: 10px;
    display: inline-block;

  }

  .legend-name {
    display: inline-block;
  }
</style>