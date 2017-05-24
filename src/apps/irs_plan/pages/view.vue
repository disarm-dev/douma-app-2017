<template>
  <div class='container'>
    <h1>IRS Plan</h1>

    <div id="map"></div>

    <md-card class="card">
      <md-card-content>
        <h3>Selected regions:</h3>
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
  import Leaflet from 'leaflet'
  import Translations from '@/lib/translations'
  import download from 'downloadjs'
  import json2csv from 'json2csv'
  import moment from 'moment'

  export default {
    name: 'IRSPlan',
    data() {
      return {
        _map: null,
        _regions_layer: null,
        regions: []
      }
    },
    mounted() {
      this.create_map()
      this.get_local_areas()
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
    methods: {
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
          let id = object.layer.feature.properties.id

          this.$store.commit('irs_plan/toggle_selected_region', id)

          this._regions_layer.setStyle(this.style_function)
        })

        this._regions_layer.addTo(this._map)
      },
      style_function(feature, layer) {
        if (this.selected_region_ids.includes(feature.properties.id)) {
          return {
            color: 'red',
            weight: 0.8
          }
        }
        return {
          color: '#756bb1',
          weight: 0.8
        }
      },
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
