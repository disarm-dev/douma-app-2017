<template>
  <div class='container'>
    <h1>IRS Plan</h1>
    <md-button @click.native="$router.push('/irs/plan')">Save</md-button>

    <md-input-container>
      <label for="hierarchy">Spatial level to select</label>
      <md-select name="hierarchy" id="hierarchy" v-model="hierarchy_name">
        <md-option v-for="{name} in hierarchies" :value="name" :key="name">{{name}}</md-option>
      </md-select>
    </md-input-container>



    <md-card class="card">
      <md-card-content>
        <plan_summary></plan_summary>
      </md-card-content>
    </md-card>

  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl'
  import download from 'downloadjs'
  import json2csv from 'json2csv'
  import moment from 'moment'
  import {mapState} from 'vuex'

  import Translations from '@/lib/translations'
  import plan_summary from './plan-summary.vue'

  mapboxgl.accessToken = 'pk.eyJ1Ijoibmljb2xhaWRhdmllcyIsImEiOiJjaXlhNWw1NnkwMDJoMndwMXlsaGo5NGJoIn0.T1wTBzV42MZ1O-2dy8SpOw';

  export default {
    name: 'IRSPlan',
    components: {plan_summary},
    data() {
      return {
        hierarchy_name: '',
        hierarchy: null,
      }
    },
    computed: {
      ...mapState({
        hierarchies: state => state.instance_config.spatial_hierarchy,
        instance_config: state => state.instance_config,
        slug: state => state.instance_config.slug.toLowerCase(),
        country: state => state.instance_config.name,
        map_focus: state => state.instance_config.map_focus,
        area_id: state => state.instance_config.area_id,

//        target_area_field_name: state => {
//          const sh = state.instance_config.spatial_hierarchy
//          return sh[sh.length - 1].field_name
//        }
      }),

    },
    watch: {
      'hierarchy_name': 'render_hierarchy',
    },
    mounted() {
      this.create_map()
    },
    methods: {
      create_map() {
        this._map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [this.instance_config.map_focus.centre.lng, this.instance_config.map_focus.centre.lat],
          zoom: this.instance_config.map_focus.zoom
        });


        this._map.on('click', (e) => {
          const feature = this._map.queryRenderedFeatures(e.point, {layers: [this.hierarchy_name + 'selected', this.hierarchy_name + 'unselected']})[0]

          if (feature) {
            feature.selected = !feature.selected
          }
        });
      },

      render_hierarchy() {
        this.hierarchy = this.hierarchies.find(h => h.name === this.hierarchy_name)

        fetch(`/static/api/${this.slug}/spatial_hierarchy/${this.slug}.${this.hierarchy_name}.geojson`)
        .then(res => res.json())
        .then((geojson) => this.add_selection_layers_for(geojson))
      },

      add_selection_layers_for(geojson) {
        this._map.addLayer({
          id: this.hierarchy_name + 'selected',
          type: 'fill',
          source: {
            type: 'geojson',
            data: geojson
          },
          paint: {
            'fill-color': 'green',
            'fill-opacity': 0.8,
            'fill-outline-color': 'black'
          },
          filter: ['==', 'selected', 'true']
        })

        this._map.addLayer({
          id: this.hierarchy_name + 'unselected',
          type: 'fill',
          source: {
            type: 'geojson',
            data: geojson
          },
          paint: {
            'fill-color': 'red',
            'fill-opacity': 0.8,
            'fill-outline-color': 'black'
          },
          filter: ['!=', 'selected', 'true']
        })
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
