<template>
  <div id="map"></div>
</template>
<script>
  import mapboxgl from 'mapbox-gl'
  import TurfHelpers from '@turf/helpers'
  import Translations from '@/lib/translations'

  export default {
    props: ['responses', 'denominator'],
    data() {
      return {
        _map: null,
        _instance_translations: null
      }
    },
    watch: {
      'responses': 'add_records'
    },
    computed: {
      feature_collection() {
        let points = this.responses.map((response) =>{
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

        this.add_records()
        this.bind_popup()
      },
      add_records() {
        this._map.on('load', () => {
          if (this.responses.length === 0) return

          if (this._map.getLayer('records')) { 
            this._map.removeLayer('records')
          }

          if (this._map.getSource('records')) { 
            this._map.removeSource('records')
          }

          const instance_translations = new Translations[this.instance_config.slug](this.instance_config)

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
              ...instance_translations.getMapStyle()
            }
          })

          // TODO: @refac There must be a better way to fit bounds of the map

          const bounds = new mapboxgl.LngLatBounds();

          this.feature_collection.features.forEach(function(feature) {
              bounds.extend(feature.geometry.coordinates);
          });

          this._map.fitBounds(bounds);
        })
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
      }
    },
    
  }
</script>
<style>
  #map {
    height: 500px
  }
</style>
