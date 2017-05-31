<template>
  <div class='container'>
    <h1>IRS Plan</h1>
    
    <md-input-container>
      <label for="hierarchy">Select Spatial Level</label>
      <md-select name="hierarchy" id="hierarchy" v-model="hierarchy_name">
        <md-option v-for="{name} in hierarchies" :value="name" :key="name">{{name}}</md-option>
      </md-select>
    </md-input-container>

    <div id="map"></div>

    <md-card class="card">
      <md-card-content>
        <h3>Selected regions:</h3>
        <md-button class='md-raised md-warn' @click.native="clear_plan">Clear plan</md-button>
        <md-button class='md-raised md-primary' @click.native="download_plan">Download plan</md-button>
        <p>Working with {{selected_regions.length}} regions, containing in total XX structures, YY rooms, ZZ population</p>
        <v-client-table
          v-if="tableData.length > 0"
          :data="tableData"
          :columns="tableColumns"
        ></v-client-table>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl'
  import Translations from '@/lib/translations'
  import download from 'downloadjs'
  import json2csv from 'json2csv'
  import moment from 'moment'

  mapboxgl.accessToken = 'pk.eyJ1Ijoibmljb2xhaWRhdmllcyIsImEiOiJjaXlhNWw1NnkwMDJoMndwMXlsaGo5NGJoIn0.T1wTBzV42MZ1O-2dy8SpOw';

  export default {
    name: 'IRSPlan',
    data() {
      return {
        _map: null,
        _regions_layer: null,
        regions: [],
        hierarchy_name: '',
        entities: []
      }
    },
    mounted() {
      this.create_map()
    },
    computed: {
      hierarchies() {
        return this.$store.state.instance_config.spatial_hierarchy
      },
      hierarchy() {
        if (this.hierarchy_name) {
          return this.$store.state.instance_config.spatial_hierarchy.find(({name}) => name == this.hierarchy_name)
        }
      },
      instance_config() {
        return this.$store.state.instance_config
      },
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
        if (this.regions.length == 0) return []

        return this.$store.state.irs_plan.selected_region_ids.map(id => {
          return this.regions.find(feature => feature.properties.id === id)
        })
      },
      selected_region_ids() {
        return this.$store.state.irs_plan.selected_region_ids
      },
      tableData() {
        return this.selected_regions.map(r => r.properties)
      },
      tableColumns() {
        return Object.keys(this.tableData[0])
      }
    },
    watch: {
      'hierarchy': 'render_hierarchy'
    },
    methods: {
      create_map() {
        this._map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [this.instance_config.map_focus.centre.lng, this.instance_config.map_focus.centre.lat],
          zoom: this.instance_config.map_focus.zoom
        });
      },

      render_hierarchy() {
        this.hierarchies.forEach(({name}) => {
          if (this._map.getLayer(name)) {
            this._map.removeLayer(name)
            this._map.removeSource(name)
          }
        })

        fetch(`/static/spatial_hierarchy/swz.${this.hierarchy_name}.geojson`)
        .then(res => res.json())
        .then((geojson) => {
          this.entities = geojson.features
          this._map.addLayer({
            id: this.hierarchy_name,
            type: 'fill',
            source: {
              type: 'geojson',
              data: geojson
            },
            'paint': {
              'fill-color': '#088',
              'fill-opacity': 0.8,
              'fill-outline-color': 'black'
            }
          })
        })

        this._map.on('click', this.hierarchy_name, function (e) {
          let feature = e.features[0]

          console.log(feature)
          console.log(this.hierarchy)
        });
      },

      clear_plan() {
        this.$store.commit('irs_plan/clear_plan')
        this._regions_layer.setStyle(this.style_function)
      },
      get_local_areas() {
        fetch(`/static/local_areas/${this.slug}.ous.json`)
          .then(res => res.json())
          .then(geojson => {
            const Translator = Translations[this.slug.toLowerCase()]
            const translations = new Translator({})
            const translated_geojson = translations.operational_units(geojson)

            this.regions = translated_geojson.features
            this.add_regions(translated_geojson)
          })
      },
      // add_regions(geojson) {

      //   this._regions_layer = L.geoJSON(geojson, {
      //     pointToLayer: (feature, latlng) => {
      //       return L.circleMarker(latlng, {});
      //     },
      //     style: this.style_function
      //   })

      //   this._regions_layer.on('click', (object, a) => {
      //     let id = object.layer.feature.properties.id

      //     this.$store.commit('irs_plan/toggle_selected_region', id)

      //     this._regions_layer.setStyle(this.style_function)
      //   })

      //   this._regions_layer.addTo(this._map)
      // },
      // style_function(feature, layer) {
      //   if (this.selected_region_ids.includes(feature.properties.id)) {
      //     return {
      //       color: 'red',
      //       weight: 0.8
      //     }
      //   }
      //   return {
      //     color: '#756bb1',
      //     weight: 0.8
      //   }
      // },
      download_plan() {
        const data = this.tableData
        const fields = this.tableColumns
        const content = json2csv({data, fields})
        const date = moment().format('YYYY-MM-DD_HHmm')

        download(content, `${this.slug}_irs_plan_${date}.csv`)
      }
    }
  }
</script>

<style scoped>
  .container {
    margin: 0 auto;
    width: 90%;
    padding: 10px;
  }

  #map {
    height: 500px;
    z-index: 0;
  }

  .card {
    margin-top: 10px;
  }
</style>
