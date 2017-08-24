<template>
  <md-card class="card">
    <md-card-content>

      <div id="map"></div>
      <map_legend
          :entries="entries_for_legend"
          :title="layer_definitions[selected_layer].legend_title"
        ></map_legend>

      <div>
        <span>Show areas by:</span>
        <md-radio v-model="selected_layer" name="map-type" md-value="coverage">Coverage</md-radio>
        <md-radio v-model="selected_layer" name="map-type" md-value="risk">Risk</md-radio>
      </div>

      <md-checkbox v-model="limit_to_plan">Limit to plan areas</md-checkbox>
      <md-checkbox v-model="show_response_points">Show response points</md-checkbox>

    </md-card-content>
  </md-card>
</template>

<script>
  import {mapGetters, mapState} from 'vuex'
  import {featureCollection, point} from '@turf/helpers'
  import bbox from '@turf/bbox'
  import centroid from '@turf/centroid'
  import numeral from 'numeral'
  import {Popup} from 'mapbox-gl'

  import {basic_map} from 'lib/helpers/basic_map.js'
  import map_legend from 'components/map_legend.vue'
  import cache from 'config/cache'
  import {get_planning_level_name} from 'lib/geodata/spatial_hierarchy_helper'
  import {layer_definitions} from 'config/map_layers'
  import {prepare_palette} from 'lib/helpers/palette_helper'
  import {LogValueConvertor} from 'lib/helpers/log_helper'

  export default {
    props: ['responses'],
    components: {map_legend},
    data() {
      return {
        layer_definitions,
        _risk_scaler: null,

        // User values
        limit_to_plan: true,
        show_response_points: true,
        selected_layer: 'coverage',

        // map cache
        _map: null,
        bbox: [],
        _click_handler: null,
        _aggregated_responses_fc: null,
        _filtered_responses_fc: null,

      }
    },
    watch: {
      'aggregated_responses': 'redraw_layers',
      'selected_layer': 'switch_layer',
      'limit_to_plan': 'redraw_layers',
      'show_response_points': 'redraw_layers'
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
      }),
      ...mapGetters({
        plan_target_area_ids: 'irs_monitor/plan_target_area_ids'
      }),
      planning_level_fc() {
        return cache.geodata[get_planning_level_name()]
      },
      entries_for_legend() {
        const layer_definition = layer_definitions[this.selected_layer]
        const palette = prepare_palette(layer_definition)


        return palette.map((array) => {
          if (this.selected_layer === 'risk' && this._risk_scaler) {
            const value = this._risk_scaler.value(array[0])
            array[0] = numeral(value).format('0.[00]')
          }

          return {
            text: array[0],
            colour: array[1]
          }
        })
      }
    },
    mounted() {
      this.render_map()
    },
    methods: {
      // Higher-level map stuff
      render_map() {
        this._map = basic_map(this.$store)

        this._map.on('load', () => {
          this.redraw_layers()
          this.fit_bounds()
        })
      },
      fit_bounds() {
        this._map.fitBounds(this.bbox, {padding: 20})
      },
      redraw_layers() {
        this.calculate_layer_attributes()
        this.switch_layer()
      },
      switch_layer() {

        this.$ga.event('irs_monitor',`view_${layer_string}`)

        this.add_response_points()
        this.add_layer(layer_string)
        this.zoom_to_features()
      },
      zoom_to_features () {
        // Zoom to features
        const layer_string = this.selected_layer
        this.bbox = bbox(this._aggregated_responses_fc)
        this.bind_popup(layer_definitions[layer_string])
      },

      // Lower-level map stuff
      clear_map() {
        const ids = ['areas', 'area_labels']
        ids.forEach((id) => {
          if (this._map.getLayer(id)) {
            this._map.removeLayer(id)
          }

          if (this._map.getSource(id)) {
            this._map.removeSource(id)
          }
        })
      },
      add_layer(layer_string) {
        this.clear_map()
        const layer_type = layer_definitions[layer_string]

        // create stops
        const palette = prepare_palette(layer_type)

        // Filter to plan if required
        let filtered_responses_fc = this._aggregated_responses_fc
        if (this.limit_to_plan) {
          filtered_responses_fc = featureCollection(this._aggregated_responses_fc.features.filter(f => {
            return this.plan_target_area_ids.includes(f.properties.__disarm_geo_id)
          }))
        }


        // Create layer and add to map
        this._map.addLayer({
          id: 'areas',
          type: 'fill',
          source: {
            type: 'geojson',
            data: filtered_responses_fc
          },
          paint: {
            'fill-color': {
              property: layer_type.attribute,
              stops: palette
            },
            'fill-opacity': 0.9,
            'fill-outline-color': 'black'
          }
        }, 'area_labels')

        const centroid_features = filtered_responses_fc.features.map((feature) => {
          const c = centroid(feature)
          c.properties = feature.properties
          return c
        })

        this._map.addLayer({
          id: 'area_labels',
          type: 'symbol',
          source: {
            type: 'geojson',
            data: featureCollection(centroid_features)
          },
          layout: {
            'text-field': `{__disarm_geo_name}`,
          }
        })

      },
      add_response_points() {
        if (this._map.getLayer('responses')) {
          this._map.removeLayer('responses')
        }

        if (this._map.getSource('responses')) {
          this._map.removeSource('responses')
        }

        if (!this.show_response_points) return

        const points = this.responses.map(response => {
          // TODO: @feature Find out if {latitude, longitude} exist on coords or coords.coords
          let coords = response.location.coords

          if (!coords.hasOwnProperty('latitude'))  {
            coords = coords.coords
          }

          const {latitude, longitude} = coords

          if (!latitude || !longitude) return null

          let coords_point = point([longitude, latitude])

          coords_point.properties = response.computed

          return coords_point
        }).filter(a => a)

        const points_fc = featureCollection(points)

        this._map.addLayer({
          id: 'responses',
          type: 'circle',
          source: {
            type: 'geojson',
            data: points_fc
          },
          paint: {
            "circle-color": {
              "property": "status",
              "type": "identity",
              "default": 'grey'
            },
            'circle-radius': {
              base: 1.75,
              stops: [[12,5],[22,20]]
            },
            'circle-opacity': 0.9,
          }
        })

      },
      bind_popup(layer_type) {
        // Remove previous click handler before anything
        this._map.off('click', 'areas', this._click_handler)

        // Define new click handler
        this._click_handler = (e) => {
          const feature = this._map.queryRenderedFeatures(e.point)[0]

          if (feature) {
            new Popup({closeOnClick: true})
              .setLngLat(e.lngLat)
              .setHTML(`<p>${layer_type.attribute}: ${feature.properties[layer_type.attribute]}</p>`)
              .addTo(this._map);
          }
        }

        // Add click handler to map
        this._map.on('click', 'areas', this._click_handler)
      },

      // Data calculations TODO: @refac Remove calculations to lib
      calculate_layer_attributes() {
        let features = this.planning_level_fc.features

        // {layers: {aggregations: ['structures sprayed'], properties: ['risk', 'number_of_households']}}
        features = this.calculate_coverage(features)
        features = this.calculate_risk(features)

        this._aggregated_responses_fc = featureCollection(features)
      },
      calculate_coverage(features) {
        const attribute = layer_definitions.coverage.attribute

        // Coverage for every planning_level area
        const aggregation_name = this.instance_config.applets.irs_monitor.aggregations.map

        return features.map((feature) => {
          const found = this.responses.find(aggregated_response => {
            return aggregated_response.__disarm_geo_id === feature.properties.__disarm_geo_id
          })

          if (found) {
            // Aggregation value is either a number or a proportion, not a percentage
            // For 'coverage' it will always be a proportion
            feature.properties[attribute] = (found[aggregation_name] * 100)
          } else {
            feature.properties[attribute] = 0
          }

          return feature
        })
      },
      /**
       * Add scaled/normalised risk to each feature
       * Also
       * @param features
       */
      calculate_risk(features) {
        const values_array= features.map(feature => feature.properties.risk).sort().filter(i => i)
        this._risk_scaler = new LogValueConvertor(values_array)

        const attribute = layer_definitions.risk.attribute
        return features.map((feature) => {
          feature.properties[attribute] = this._risk_scaler.lval(feature.properties.risk)
          return feature
        })
      },
    }
  }
</script>
<style>
  #map {
    height: 500px
  }
</style>
