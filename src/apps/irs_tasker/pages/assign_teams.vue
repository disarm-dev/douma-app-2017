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
  import {get_geodata_area} from 'lib/data/remote'
  import {basic_map} from 'lib/basic_map.js'

  export default {
    data() {
      return {
        geodata_areas: null,
        palette: [],
        selected_team: null
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        teams: state => state.irs_tasker.teams,
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
        console.log('draw', this.palette)

        this._map.fitBounds(bbox(this.geodata_areas), {padding: 20});
      },
      bind_click_handler() {
        this._map.on('click', 'areas', (e) => {
          const clicked_feature = this._map.queryRenderedFeatures(e.point)[0]

          const field_name = this.instance_config.spatial_hierarchy.find((sp) => sp.hasOwnProperty('denominator')).field_name 

          let index = this.geodata_areas.features.findIndex((feature) => feature.properties[field_name] === clicked_feature.properties[field_name])
          this.geodata_areas.features[index].properties.team = this.selected_team.id
          
          this._map.getSource('areas').setData(this.geodata_areas)         
        })
      }
    }
  }
</script>
<style>
  #map {
    height: 500px
  }
</style>