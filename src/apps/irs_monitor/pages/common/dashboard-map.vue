<template>
  <div>
    <p>Show areas by:</p>
    <div>
      <md-radio v-model="selected" :disabled='!geodata_areas' name="map-type" md-value="risk" @change="select_map_type">Risk</md-radio>
      <md-radio v-model="selected" :disabled='!geodata_areas' name="map-type" md-value="coverage" @change="select_map_type">Coverage</md-radio>
    </div>
    <md-checkbox v-model="limit_to_plan">Limit to plan areas</md-checkbox>
    <div id="map"></div>
  </div>
</template>

<script>
  import {featureCollection} from '@turf/helpers'
  import bbox from '@turf/bbox'
  import mapboxgl from 'mapbox-gl'
  import chroma from 'chroma-js'

  import {basic_map} from 'lib/basic_map.js'
  import Presenters from 'lib_instances/presenters'
  import {get_geodata_area} from 'lib/data/remote'
  import logscale from 'lib/log_scale.js'
  import {Aggregator} from 'lib_instances/aggregations'
  import {get_planning_level_id_field, get_planning_level_name} from 'lib/spatial_hierarchy_helper'

  export default {
    props: ['aggregated_responses'],
    data() {
      return {
        _map: null,
        geodata_areas: null,
        limit_to_plan: true,
        selected: 'risk',

        // Click handlers
        _risk_click_handler: null,
        _coverage_click_handler: null,
      }
    },
    watch: {
    },
    computed: {
      instance_config() {
        return this.$store.state.instance_config
      },
      plan_target_area_ids() {
        if (!this.$store.state.irs_monitor.plan) {
          return []
        }

        return this.$store.state.irs_monitor.plan.targets.map(target => target.id)
      },
      planning_level_id_field() {
        return get_planning_level_id_field(this.instance_config) // Get field name e.g AggUniCod
      }
    },
    mounted() {
      this.create_map()
    },
    methods: {
      create_map() {
        this._map = basic_map(this.$store)

        this._map.on('load', () => {
          this.load_geodata().then(() => {
            this.add_areas_coloured_by_risk()
          })
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
        const area_type = get_planning_level_name(this.instance_config)

        return get_geodata_area({slug: this.instance_config.slug, level: area_type})
          .then((areas) => {
            this.geodata_areas = areas
            return Promise.resolve()
          })
          .catch((e) => {
            console.log(e)
          })
      },

      select_map_type(type) {
        this.remove_click_handlers()

        switch (type) {
          case 'risk':
            this.$ga.event('irs_monitor','view_risk')
            return this.add_areas_coloured_by_risk()
          case 'coverage':
            this.$ga.event('irs_monitor','view_coverage')
            return this.add_areas_coloured_by_coverage()
        }
      },

      remove_click_handlers() {
        this._map.off('click', 'areas_by_coverage', this._coverage_click_handler)
        this._map.off('click', 'areas_by_risk', this._risk_click_handler)
      },

      // COVERAGE
      add_areas_coloured_by_coverage() {
        this.clear_map()

        // Get aggregation name
        const aggregation_name = this.instance_config.applets.irs_monitor.aggregations.map

        // Filter features/areas to only those in the plan (i.e. in aggregated_responses), then add aggregated property to each
        const features = this.geodata_areas.features.filter(feature => {
          if(!this.limit_to_plan) return true
          return this.plan_target_area_ids.includes(feature.properties[this.planning_level_id_field])
        }).map((feature) => {
            const found = this.aggregated_responses.find(aggregation => aggregation[this.planning_level_id_field] === feature.properties[this.planning_level_id_field])
            if (found) {
              feature.properties.coverage = (found[aggregation_name] * 100) // Aggregation value is a proportion, not a percentage
            } else {
              feature.properties.coverage = 0
            }

            return feature
        })

        const areas_with_coverage = featureCollection(features)

        // create stops
        const scale = chroma.scale("RdYlGn").colors(11)
        const steps = [...Array(11).keys()].map(i => i * 10)
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
            'fill-opacity': 0.9,
            'fill-outline-color': '#262626'
          }
        })

        this._map.fitBounds(bbox(areas_with_coverage), {padding: 20});
        this.bind_coverage_popup()

      },
      bind_coverage_popup() {
        this._coverage_click_handler = (e) => {
          const feature = this._map.queryRenderedFeatures(e.point)[0]

          if (feature) {
            new mapboxgl.Popup({closeOnClick: true})
              .setLngLat(e.lngLat)
              .setHTML(`<p>Coverage: ${feature.properties.coverage}</p>`)
              .addTo(this._map);
          }
        }

        this._map.on('click', 'areas_by_coverage', this._coverage_click_handler)
      },

      // RISK
      add_areas_coloured_by_risk() {
        this.clear_map()

        this.get_log_values(this.geodata_areas)

        const features = this.geodata_areas.features.filter(feature => {
          if(!this.limit_to_plan) return true
          return this.plan_target_area_ids.includes(feature.properties[this.planning_level_id_field])
        }).map((feature) => {
          feature.properties.normalised_risk = this.log_scale(feature.properties.risk)
          return feature
        })

        const areas_with_normalised_risk = featureCollection(features)

        // create stops
        const scale = chroma.scale("RdYlBu").colors(11).reverse()
        const steps = [...Array(11).keys()].map(i => i * 10)
        const stops = steps.map((step, index) => {
          return [step, scale[index]]
        })

        this._map.addLayer({
          id: 'areas_by_risk',
          type: 'fill',
          source: {
            type: 'geojson',
            data: areas_with_normalised_risk
          },
          paint: {
            'fill-color': {
              property: 'normalised_risk',
              // TODO: @feature Use a different palette
              stops: stops
            },
            'fill-opacity': 0.9,
            'fill-outline-color': 'black'
          }
        }, 'records')

        this._map.fitBounds(bbox(areas_with_normalised_risk), {padding: 20});
        this.bind_risk_popup()
      },
      bind_risk_popup() {
        this._risk_click_handler = (e) => {
          const feature = this._map.queryRenderedFeatures(e.point)[0]

          if (feature) {
            new mapboxgl.Popup({closeOnClick: true})
              .setLngLat(e.lngLat)
              .setHTML(`<p>Risk: ${feature.properties.normalised_risk}</p>`)
              .addTo(this._map);
          }

        }
        this._map.on('click', 'areas_by_risk', this._risk_click_handler)
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
