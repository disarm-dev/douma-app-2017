<template>
  <div class="container">
    <h1>Assign teams</h1>

    <div class="md-subheading">Select team:</div>
    <md-menu>
      <md-button md-menu-trigger>{{selected_team.name}}</md-button>

      <md-menu-content>
        <md-menu-item v-for="team in teams" :key="team.id" @selected="selected_team = team">
          {{team.name}}
        </md-menu-item>
      </md-menu-content>
    </md-menu>

    <div id="map"></div>
    
  </div>
</template>
<script> 
  import {mapState} from 'vuex'
  import bbox from '@turf/bbox'
  import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw'
  import intersect from '@turf/intersect'
  import {get_geodata_area} from 'lib/data/remote'
  import {basic_map} from 'lib/basic_map.js'

  export default {
    data() {
      return {
        geodata_areas: null,
        palette: [],
        selected_team: null,
        click_handler: null
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        teams: state => state.irs_tasker.teams,
        id_field: state => state.instance_config.spatial_hierarchy.find((sp) => sp.hasOwnProperty('denominator')).field_name 
      })
    },
    created() {
      this.selected_team = this.teams[0]
      this.create_palette()
    },
    mounted() {
      this.create_map()
    },
    methods: {
      create_palette() {
        this.palette = this.teams.map((team) => {
          return [team.id, team.colour]
        })
      },
      create_map() {
        this._map = basic_map(this.$store)

        this._map.on('load', () => {
          this.load_geodata().then(() => {
            this.geodata_areas.features = this.geodata_areas.features.map((feature) => {
              feature.properties.team = ''
              return feature
            })

            this.add_areas()
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
      add_areas(areas) {
        if (this._map.getLayer('areas')) {
          this._map.removeLayer('areas')
        }

        if (this._map.getSource('areas')) {
          this._map.removeSource('areas')
        }
        
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
              property: 'team',
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

          // TODO: @feature Add clicked areas to an array of selected areas
          let index = this.geodata_areas.features.findIndex((feature) => feature.properties[this.id_field] === clicked_feature.properties[this.id_field])


          let selected_area_id = this.geodata_areas.features[index].properties[this.id_field]
          this.$store.commit('irs_tasker/toggle_selected_area', {team: this.selected_team.id, area_id: selected_area_id})

          // This seems like a good way to handle updating the map
          this.geodata_areas.features[index].properties.team = this.selected_team.id
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
                  const area_id = polygon.properties[this.id_field]
                  this.$store.commit('irs_tasker/toggle_selected_area', {team: this.selected_team.id, area_id: area_id })
              }
            })

            selected_area_indicies.forEach((index) => {
              this.geodata_areas.features[index].properties.team = this.selected_team.id
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
<style>
  #map {
    height: 500px
  }
</style>