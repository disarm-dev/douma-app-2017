<template>
  <div>
    <div>
      <md-button class="md-raised" :disabled='!geodata_areas' @click.native="add_areas_coloured_by_risk">Show areas by risk</md-button>
      <md-button class="md-raised" :disabled='!geodata_areas' @click.native="add_areas_coloured_by_coverage">Show areas by spray coverage</md-button>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl'
  import {featureCollection} from '@turf/helpers'
  import bbox from '@turf/bbox'
  import chroma from 'chroma-js'

  import Presenters from 'lib/presenters'
  import {get_geodata_area} from 'lib/data/remote'
  import logscale from 'lib/log_scale.js'
  import {Aggregator} from 'lib/aggregations'

  export default {
    props: ['response_aggregations'],
    data() {
      return {
        _map: null,
        geodata_areas: null,
      }
    },
    watch: {
    },
    computed: {
      instance_config() {
        return this.$store.state.instance_config
      },
    },
    mounted() {
      this.create_map()
    },
    methods: {
      create_map() {
        this._map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [22.63977015806131, -25.276453102086563],
          zoom: 4
        });

        this._map.on('load', () => {
          this.load_geodata()
        })
      },
      clear_map() {
        ['areas_by_coverage', 'areas_by_risk'].forEach((id) => {
          if (this._map.getLayer(id)) {
            this._map.removeLayer(id)
          }

          if (this._map.getSource(id)) {
            this._map.removeSource(id)
          }
        })

      },

      load_geodata() {
        let area_type
        if (this.area) {
          // console.log('Got an area, need to do something')
        } else {
          // take the first spatial_hierarchy
          area_type = this.instance_config.spatial_hierarchy[0].name
          console.warn('Using the first spatial spatial_hierarchy for instance:', area_type)
        }

        get_geodata_area({slug: this.instance_config.slug, level: area_type})
          .then((areas) => {
            this.geodata_areas = areas
          })
          .catch((e) => {
            console.log(e)
          })

      },

      // COVERAGE
      add_areas_coloured_by_coverage() {
        this.clear_map()

        // Get field name e.g AggUniCod
        const found = this.instance_config.spatial_hierarchy.find(h => h.hasOwnProperty('denominator'))
        if (!found) throw new Error('Cannot find denominator field_name on instance_config')
        const target_area_id_field = found.field_name

        // Get aggregation name
        const aggregation_name = this.instance_config.applets.irs_monitor.aggregations.map


        const features = this.geodata_areas.features.map((feature) => {
          const found = this.response_aggregations.find(a => a[target_area_id_field] === feature.properties[target_area_id_field])
          if (found) {
            feature.properties.coverage = (found[aggregation_name] * 100) // Aggregation value is a proportion, not a percentage
          }
          return feature
        })

        const areas_with_coverage = featureCollection(features)

        // create stops
        const scale = chroma.scale("RdYlGn").colors(11)
        const steps = Array.from(new Array(11), (x,i) => i * 10)
        const stops = steps.map((step, index) => {
          return [step, scale[index]]
        })

        this._map.addLayer({
          id: 'areas_by_coverage',
          type: 'fill',
          source: {
            type: 'geojson',
            data: areas_with_coverage
          },
          paint: {
            'fill-color': {
              property: 'coverage',
              stops: stops
            },
            'fill-opacity': 0.7,
            'fill-outline-color': '#262626'
          }
        })

        this._map.fitBounds(bbox(areas_with_coverage), {padding: 20});
        this.bind_popup()

      },
      bind_popup() {
        this._map.on('click', (e) => {
          const feature = this._map.queryRenderedFeatures(e.point, {layers: ['areas_by_coverage']})[0]

          if (feature) {
            new mapboxgl.Popup({closeOnClick: true})
              .setLngLat(e.lngLat)
              .setHTML(JSON.stringify(feature.properties.coverage))
              .addTo(this._map);
          }

        })
      },

      // RISK
      add_areas_coloured_by_risk() {
        this.clear_map()

        this.get_log_values(this.geodata_areas)

        const features = this.geodata_areas.features.map((feature) => {
          feature.properties.normalised_risk = this.log_scale(feature.properties.risk)
          return feature
        })

        // create stops
        const scale = chroma.scale("RdYlBu").colors(11)
        const steps = Array.from(new Array(11), (x,i) => i * 10)
        const stops = steps.map((step, index) => {
          return [step, scale[index]]
        })

        this._map.addLayer({
          id: 'areas_by_risk',
          type: 'fill',
          source: {
            type: 'geojson',
            data: featureCollection(features)
          },
          paint: {
            'fill-color': {
              property: 'normalised_risk',
              // TODO: @feature Use a different palette
              stops: stops
            },
            'fill-opacity': 0.7,
            'fill-outline-color': 'black'
          }
        }, 'records')
      },
      get_log_values(areas) {
        const values_array = areas.features.map(area => area.properties.risk).sort()
        const non_zeros = values_array.filter(v => v !== 0)

        const mino = Math.min(...non_zeros)
        const maxo = Math.max(...values_array) * 1.001

        this.log_scale = logscale(mino, maxo)

        if (this.log_scale(mino) !== 0) console.log('min should be 0', this.log_scale(mino))
        if (this.log_scale(maxo) !== 100) console.log('max should be 100', this.log_scale(maxo))
      },

    }
  }
</script>
<style>
  #map {
    height: 500px
  }
</style>
