<template>
  <div id="weather-map"></div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  export default {
    name: 'ClimateMap',
    props: ['date', 'layer'],
    mounted() {
      this.create_map()
    },
    watch: {'date': 'change_tile_layer', 'layer': 'change_tile_layer'},
    data () {
      return {
        map: null,
        legend: null,
        tile_layer: null,
        opacity_slider: null
      }
    },
    computed: {
      tile_url() {
        const root_url = WEATHER_API_URL
        return `${root_url}/${this.date}_${this.layer.slug}/{z}/{x}/{y}.png`
      }
    },
    methods: {
      create_map() {
        this.map = Leaflet.map('weather-map', {
          center: {lat: -18.656654486540006, lng: 29.575195312500004},
          zoom: 6
        });

        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        Leaflet.tileLayer(url).addTo(this.map)

        // this.opacity_slider = new L.Control.opacitySlider()
        // this.map.addControl(opacity_slider)
      },
      change_tile_layer() {
        if (!this.layer || !this.date) return

        if (this.tile_layer) {
          this.map.removeLayer(this.tile_layer)
          this.tile_layer = null
        }

        this.tile_layer = L.tileLayer(this.tile_url, {tms: true})//, opacity: 0.6})
        this.tile_layer.addTo(this.map)

        this.update_legend()
        
        // this.opacity_slider.setOpacityLayer(this.tile_layer)
      },
      update_legend() {
        
        fetch('http://130.211.51.103:3000/processor/palettes/' + this.layer.slug + '_palette')
          .then(res => res.text())
          .then(res => {
            let labels = []
            let colors = []
            let title = null

            res.split('\n').map((line) => {
              let parts = line.split(',')

              if (parts[0]) {
                labels.push(parts[0])
                colors.push(`rgb(${parts[1]}, ${parts[2]}, ${parts[3]})`)
              }
            })

            labels = labels.map((label) => {
              switch (this.layer.slug) {
                case 'LST':
                  title = '°C'
                  label = Math.round((0.02 * label) - 273.15)
                  break;
                case 'PRECIP':
                  title = 'Max daily mm'
                  label = Math.round(label / 5)
                  break;
                case 'EVI':
                  title = 'Max daily mm'
                  let customRound = function(number, precision) {
                      var factor = Math.pow(10, precision);
                      var tempNumber = number * factor;
                      var roundedTempNumber = Math.round(tempNumber);
                      return roundedTempNumber / factor;
                  }
                  label = customRound(label, 3)
                  break;
              }
              return label
            })

            if (this.legend) {
              this.map.removeControl(this.legend)
              this.legend = null
            }
            
            this.legend = Leaflet.control({position: 'bottomright'});

            this.legend.onAdd = function (map) {

                var div = Leaflet.DomUtil.create('div', 'info legend')

                if (title) {
                  div.innerHTML += `<p><b>${title}</b></p>`
                }

                for (var i = 0; i < labels.length; i++) {

                    div.innerHTML += 
                        '<i style="background:' + colors[i] + '"></i> ' +
                        labels[i] + (labels[i + 1] !== undefined ? '&ndash;' + labels[i + 1] + '<br>' : '+');
                }

                div.style = "background: white; border-radius: 5px; padding: 10px;"
                return div;
            };

            this.legend.addTo(this.map);
          })


      }
    }
  }
</script>

<style>
  #weather-map {
    min-height: calc(100vh - 270px);
    z-index: 0;
  }

  .legend {
    line-height: 18px;
    color: #555;
  }

  .legend i {
      width: 18px;
      height: 18px;
      float: left;
      margin-right: 8px;
      opacity: 0.7;
  }
</style>