<template>
  <div id="map"></div>
</template>

<script>

  import mapboxgl from 'mapbox-gl'
  mapboxgl.accessToken = 'pk.eyJ1Ijoibmljb2xhaWRhdmllcyIsImEiOiJjaXlhNWw1NnkwMDJoMndwMXlsaGo5NGJoIn0.T1wTBzV42MZ1O-2dy8SpOw';

  export default {
    name: 'plan_map',
    props: ['edit'],
    data() {
      return {
        _map: null,
      }
    },
    mounted() {
      if (this.edit) {
        console.log('can edit')
      } else {
        console.log('cannot edit')
      }


//      fetch(`/static/api/${this.slug}/spatial_hierarchy/${this.slug}.${this.hierarchy_name}.geojson`)
//        .then(res => res.json())
//        .then((geojson) => this.add_selection_layers_for(geojson))
//


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
      }
    }
  }
</script>

<style>

</style>
