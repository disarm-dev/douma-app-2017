<template>
  <div>
    <h1>IRS Plan: {{country}}</h1>
    
    <div id="map"></div>
  </div>
</template>

<script>
  import Leaflet from 'leaflet'

  export default {
    name: 'IRSPlan',
    data() {
      return {
        _map: null,
        _regions_layer: null
      }
    },
    mounted() {
      fetch(`/static/local_areas/${this.slug}.json`)
        .then(res => res.json()) 
        .then(geojson => {
          this.create_map()
          this.add_regions(geojson)
        })
    },
    computed: {
      slug() {
        return this.$store.state.instance_config.slug.toLowerCase()
      },
      country() {
        return this.$store.state.instance_config.name
      },
      map_focus() {
        return this.$store.state.instance_config.map_focus
      },
      area_id() {
        return this.$store.state.instance_config.area_id
      },
      selected_regions() {
        return this.$store.state.irs_plan.selected_regions
      }
    },
    methods: {
      create_map() {
        this._map = Leaflet.map('map', {
          tms: true,
          center: this.map_focus.centre,
          zoom: this.map_focus.zoom
        });

        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        Leaflet.tileLayer(url).addTo(this._map);
      },
      add_regions(geojson) {

        this._regions_layer = L.geoJSON(geojson, {
          pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {});
          },
          style: this.style_function
        })

        this._regions_layer.on('click', (object, a) => {
          console.log(object.layer.feature.properties)
          let id = object.layer.feature.properties[this.area_id]

          this.$store.commit('irs_plan/toggle_selected_region', id)

          this._regions_layer.setStyle(this.style_function)
        })

        this._regions_layer.addTo(this._map)
      },
      style_function(feature, layer) {
        if (this.selected_regions.includes(feature.properties[this.area_id])) {
          return {
            color: 'red',
            weight: 0.8
          }
        }
        return {
          color: '#756bb1',
          weight: 0.8
        }
      }
    }
  }
</script>

<style scoped>
  #map {
    height: 500px;
    margin: 0 2.5%;
  }
</style>
