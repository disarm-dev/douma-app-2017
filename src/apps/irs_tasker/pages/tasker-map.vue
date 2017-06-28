<template>
  <div id="map"></div>
</template>

<script>
  import {mapState} from 'vuex'
  import {featureCollection} from '@turf/helpers'
  import bbox from '@turf/bbox'
  import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw'
  import intersect from '@turf/intersect'

  import {basic_map} from 'lib/basic_map.js'
  import cache from 'config/cache'
  import {get_geodata} from 'lib/data/remote'

  export default {
    name: 'tasker-map',
    props: ['assignments', 'decorated_teams'], // The `cache` is also a source of data in this view
    data() {
      return {
        _map: null,
        _draw_control: null,
        _click_handler: null,
        assignment_fc: null
      }
    },
    computed: {
      ...mapState({
        id_field: state => state.instance_config.spatial_hierarchy.find((sp) => sp.hasOwnProperty('denominator')).field_name ,
      })
    },
    watch: {'assignments': 'redraw_assignments'},
    mounted() {
      this.create_map()
    },
    methods: {
      create_map() {
        this._map = basic_map(this.$store)

        this._map.on('load', () => {
          get_geodata(this.$store).then(() => {
            this.assignment_fc = this.create_assignment_polygons()

            if (this.assignment_fc) {
              this.draw_areas()
              this.bind_click_handler()
              this.add_draw_controls()
            }
          })
        })
      },
      draw_areas() {
        debugger
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
            data: this.assignment_fc
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

        this._map.fitBounds(bbox(this.assignment_fc), {padding: 20});
      },

      // Click listeners
      bind_click_handler() {
        this._click_handler = (e) => {
          const clicked_feature = this._map.queryRenderedFeatures(e.point)[0]

          // Update the map
          const index = this.assignment_fc.features.findIndex((feature) => feature.properties[this.id_field] === clicked_feature.properties[this.id_field])
          this.assignment_fc.features[index].properties.team_name = this.selected_team_name
          this._map.getSource('areas').setData(this.assignment_fc)

          // Update store
          const area_id = clicked_feature.properties[this.id_field]
          this.$emit('assign_areas_to_selected_team', area_id)
        }
        this._map.on('click', 'areas', this._click_handler)
      },
      remove_click_handler() {
        this._map.off('click', 'areas', this._click_handler)
        this._click_handler = null
      },

      // Draw controls
      add_draw_controls () {
        if (!this._map) return

        const options = {
          boxSelect: false,
          keyBindings: false,
          displayControlsDefault: false,
          controls: {
            polygon: true
          }
        }
        this._draw_control = new MapboxDraw(options)

        // Remove click handler when you start to draw - avoids selecting first polygon
        this._map.on('draw.modechange', (e) => {
          if(e.mode === 'draw_polygon') this.remove_click_handler()
        })

        // Watch for a new polygon being completed
        this._map.on('draw.create', (e) => {
          const drawn_polygon = e.features[0]
          const all_polygons = this.assignment_fc.features
          const area_ids = []

          // Find all polygons which intersect with the drawn polygon
          all_polygons.forEach((polygon, index) => {
            if (intersect(drawn_polygon, polygon)) {
              const area_id = polygon.properties[this.id_field]
              area_ids.push(area_id)
            }
          })

          this.$emit('assign_areas_to_selected_team', area_ids)

          // Clear your lovely polygon
          this._draw_control.deleteAll()

          // Rebind the original click handler
          this.bind_click_handler()
        })


        this._map.addControl(this._draw_control)
      },
      remove_draw_controls () {
        if (this._draw_control) {
          this._map.removeControl(this._draw_control)
          this._draw_control = null
        }
      },

      create_assignment_polygons() {
        if (!this.assignments.length) {
          console.warn("No idea about assignments, please give me a plan")
          return null
        } else {
          const features = this.assignments.map(a => {
            const found = cache.geodata.all_target_areas.features.find(f => f.properties[this.id_field] === a.area_id)

            if (found) {
              found.properties.team_name = a.team_name
            } else {
              throw new Error(`Cannot find geodata for ${a.area_id}`)
            }

            return found
          })

          return featureCollection(features)
        }
      },
      redraw_assignments() {
        console.log("doing what? ")
        this.draw_areas()
      }
    }
  }
</script>

<style scoped>
  #map {
    height: 500px
  }
</style>
