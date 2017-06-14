<template>
  <div>
    <div>
      <md-button class="md-raised" @click.native="add_areas_by_risk">Show areas by risk</md-button>
      <md-button class="md-raised" @click.native="add_areas_by_coverage">Show areas by spray coverage</md-button>
    </div>
    <div id="map"></div>
  </div>
</template>
<script>
  import mapboxgl from 'mapbox-gl'
  import TurfHelpers from '@turf/helpers'
  import Translations from '@/lib/translations'
  import {get_area} from '@/lib/data/remote'
  import logscale from '@/lib/log_scale.js'
  import AllAggregations from '@/lib/aggregations'

  export default {
    props: ['responses', 'denominator', 'area'],
    data() {
      return {
        _map: null,
        _instance_translations: null,
        map_loaded: false,
        areas: null
      }
    },
    watch: {
      'responses': 'update_records'
    },
    computed: {
      feature_collection() {
        let points = this.responses.map((response) => {
          let {latitude, longitude} = response.location.coords
          let point = TurfHelpers.point([longitude, latitude])
          /* 
            Mapbox does not support dynamic styling via child properties
            so trying to decide color from 'form_data.visit_type' won't work
            so we move all form_data properties to the properties of the geojson feature
            TODO: @refac Find another way to style features dynamically
          */
          point.properties = {...response, ...response.form_data}
          return point
        })
        return TurfHelpers.featureCollection(points)
      },
      instance_config() {
        return this.$store.state.instance_config
      }
    },
    mounted() {
      this._instance_translations = new Translations[this.instance_config.slug](this.instance_config)
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
          this.map_loaded = true
          this.add_records()
          this.bind_popup()
          this.get_areas()
        })
      },
      update_records() {
        if (this.map_loaded) {
          this.add_records()
        } else {
          this._map.on('load', () => {
            this.add_records()
          })
        }
      },
      add_records() {
        if (this.responses.length === 0) return

        if (this._map.getLayer('records')) { 
          this._map.removeLayer('records')
        }

        if (this._map.getSource('records')) { 
          this._map.removeSource('records')
        }

        this._map.addLayer({
          id: 'records',
          type: 'circle',
          source: {
            type: 'geojson',
            data: this.feature_collection
          },
          paint: {
            'circle-radius': {
              'base': 1.75,
              'stops': [[8, 10], [22, 100]]
            },
            'circle-stroke-width': 1,
            'circle-stroke-color': '#959292',
            ...this._instance_translations.getMapStyle()
          }
        })

        // TODO: @refac There must be a better way to fit bounds of the map

        const bounds = new mapboxgl.LngLatBounds();

        this.feature_collection.features.forEach(function(feature) {
            bounds.extend(feature.geometry.coordinates);
        });

        this._map.fitBounds(bounds, {padding: 20});
      },
      bind_popup() {
        this._map.on('click', (e) => {
          const feature = this._map.queryRenderedFeatures(e.point, {layers: ['records']})[0]

          if (feature) {
            new mapboxgl.Popup({closeOnClick: true})
              .setLngLat(e.lngLat)
              .setHTML(this._instance_translations.getPopupDescription(feature))
              .addTo(this._map);
          }

        })
      },
      get_areas() {
        let area_type
        if (this.area) {
          // console.log('Got an area, need to do something')
        } else {
          // take the first spatial_hierarchy
          area_type = this.instance_config.spatial_hierarchy[0].name
          console.warn('Using the first spatial spatial_hierarchy for instance:', area_type)
        }

        get_area({slug: this.instance_config.slug, level: area_type})
          .then((areas) => {
            this.areas = areas
          })
          .catch((e) => {
            console.log(e)
          })
        
      },
      add_areas_by_risk() {
        this.clear_map()

        this.get_log_values(this.areas)

        let features = this.areas.features.map((feature) => {
          feature.properties.normalised_risk = this.log_scale(feature.properties.risk)
          return feature
        })

        let fc = {
          type: 'FeatureCollection',
          features
        }

        this._map.addLayer({
          id: 'areas_by_risk',
          type: 'fill',
          source: {
            type: 'geojson',
            data: fc
          },
          paint: {
            'fill-color': {
              property: 'normalised_risk',
              // TODO: @feature Use a different palette
              stops: [
                [0, '#F2F12D'],
                [10, '#F2F12D'],
                [20, '#F2F12D'],
                [30, '#EED322'],
                [40, '#E6B71E'],
                [50, '#DA9C20'],
                [60, '#CA8323'],
                [70, '#B86B25'],
                [80, '#A25626'],
                [90, '#8B4225'],
                [100, '#723122']
              ]
            },
            'fill-opacity': 0.7,
            'fill-outline-color': 'black'
          }
        }, 'records')
      },
      add_areas_by_coverage() {
        this.clear_map()

        let area_field_name = this.instance_config.spatial_hierarchy[0].field_name
        

        let features = this.areas.features.map((feature) => {
          feature.properties.coverage = this.get_coverage_for_local_area(feature, area_field_name)
          // feature.properties.risk = this.log_scale(feature.properties.risk)
          return feature
        })
        let fc = {
          type: 'FeatureCollection',
          features
        }

        this._map.addLayer({
          id: 'areas_by_coverage',
          type: 'fill',
          source: {
            type: 'geojson',
            data: fc
          },
          paint: {
            'fill-color': {
              property: 'coverage',
              // TODO: @feature Use a different palette
              stops: [
                [0, '#f44336'],
                [10, '#e34e39'],
                [20, '#d2593b'],
                [30, '#c2633e'],
                [40, '#b16e40'],
                [50, '#a07943'],
                [60, '#8f8446'],
                [70, '#7e8f48'],
                [80, '#6e994b'],
                [90, '#5da44d'],
                [100, '#4caf50']
              ]
            },
            'fill-opacity': 0.7,
            'fill-outline-color': 'black'
          }
        }, 'records')
      },
      get_coverage_for_local_area(area, field_name) {
        let responses_for_area = this.responses.filter((res) => {
          return res.location_selection.id === area.properties[field_name]
        })

        let aggregations = AllAggregations[this.instance_config.slug]

        let aggregation = aggregations[this.instance_config.applets.irs_monitor.aggregation_for_map]

        // console.log('area', area.properties[field_name], responses_for_area.length)
        let coverage = aggregation(responses_for_area, this.denominator)

        coverage = parseFloat(coverage.substring(0, coverage.length -1))

        
        if (coverage !== 0) {
          console.log('area', field_name, area.properties[field_name])
          console.log('coverage', coverage)
        }

        return coverage
      },
      get_log_values(areas) {
        const values_array = areas.features.map(area => area.properties.risk).sort()
        const non_zeros = values_array.filter(v => v !== 0)

        const mino = Math.min(...non_zeros)
        const maxo = Math.max(...values_array) * 1.001
        

        this.log_scale = logscale(mino, maxo)

        console.log('// TODO: @refac Move to tests')
        console.log('min should be 0', this.log_scale(mino))
        console.log('max should be 100', this.log_scale(maxo))
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
         
      }
    }
  }
</script>
<style>
  #map {
    height: 500px
  }
</style>
