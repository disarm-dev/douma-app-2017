<template>
  <div>
    <div>
      <input type="radio" id="one" value="text" v-model="type">
      <label for="one">Text</label>
      <br>
      <input type="radio" id="two" value="point" v-model="type">
      <label for="two">Point</label>
      <br>
      <input type="radio" id="three" value="structure" v-model="type">
      <label for="three">Structure</label>
      <br>
    </div>

    <div v-show="type === 'text'">
      <p><input @change="on_text_change" type="text" placeholder="Enter location"></p>
    </div>

    <div v-show="type === 'point'">
      <p>{{location_message}}</p>
    </div>

    <div v-show="type === 'structure'">
      <div id="map"></div>
      <!-- <p>Structure is not supported yet.</p> -->
    </div>
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl'
  mapboxgl.accessToken = 'pk.eyJ1Ijoibmljb2xhaWRhdmllcyIsImEiOiJjaXlhNWw1NnkwMDJoMndwMXlsaGo5NGJoIn0.T1wTBzV42MZ1O-2dy8SpOw';

  export default {
    name: 'location',
    props: ['existing_location'],
    data() {
      return {
        type: 'text',
        location_message: 'Nothing',
        _map: null
      }
    },
    watch: {
      'type': 'update_location'
    },
    mounted() {
      if (this.existing_location) {
        this.emit_location(this.existing_location)
      }
    },
    methods: {
      update_location() {
        switch (this.type) {
          case 'point':
            this.find_location()
            break;
          case 'structure':
            this.create_map()
            break;
        }
      },
      create_map() {
        
        this._map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [31.922872211671347, -26.207653255480984],
          zoom: 17
        });


        fetch('/static/structures.json')
        .then((res) => res.json())
        .then((geojson) => {
          this._map.on('load', () => {

            this._map.addLayer({
              id: 'structures_layer',
              type: 'fill',
              source: {
                type: 'geojson',
                data: geojson
              },
              layout: {},
              paint: {
                'fill-color': 'blue',
                'fill-opacity': 0.5
              }
            })

            this._map.on('click', (e) => {
              const structure = this._map.queryRenderedFeatures(e.point, {layers: ['structures_layer']})[0]

              let {properties, type, geometry} = structure
              this.emit_location({
                type: 'structure',
                geojson: {properties, type, geometry}
              })
            })

            this.$nextTick(() => {
              this._map.resize()
            })
          })
        })

        
      },
      find_location() {
        if ("geolocation" in navigator) {
          this.location_message = 'Hunting...'
          navigator.geolocation.getCurrentPosition((position) => {
            
            let {latitude, longitude, accuracy} = position.coords
            accuracy = accuracy / 2
            this.location_message = `Found: ${latitude} ${longitude} (accurate +/- ${accuracy}m)`

            this.emit_location({
              type: 'point',
              point: {latitude, longitude, accuracy}
            })
          });
        } else {
          // TODO @refac Handle the case where geolocation api is not available
        }
      },
      on_text_change(e) {
        this.emit_location({
          type: 'text',
          text: e.target.value
        })
      },

      emit_location(val) {
        this.$emit('change', val)
      }
    }
  }  
</script>

<style>
  #map {
    height: 450px;
  }
</style>