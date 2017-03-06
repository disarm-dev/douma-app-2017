<template>
  <div>
    <div class="container">
      <h1>Clustering preview</h1>
      <p>Are you happy with these Clusters?</p>
      <md-button class='md-primary md-raised' @click.native="post_clusters">YES (save)</md-button>
      <md-button class='md-warn' @click.native="$router.push({name: 'irs_plan:create:select_ous'})">NO (start again)</md-button>
    </div>
    <div id='map'></div>
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
  import 'mapbox-gl/dist/mapbox-gl.css'

  export default {
    name: 'ReviewMap',
    data() {
      return {
        map: {},
        clusters_layer: null,
      }
    },
    watch: {
      // '$store.state.irs.clusters': 'draw_clusters',
    },
    mounted() {
      this.$store.commit('root:set_loading', true)
      this.create_map()
      fetch('/assets/swz.clusters.sample.json').then((res) => res.json()).then((json) => {
      // fetch('/assets/swz.all-clusters.geojson').then((res) => res.json()).then((json) => {
        window.json = json
        this.draw_clusters(json)
      })
    },
    methods: {
      post_clusters() {
        this.$store.dispatch('irs_plan:post_clusters').then(() => {
          this.$router.push({name: 'irs_plan'})
        })
      }, 
      create_map() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA';
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [31.50484892885717, -26.543508675283874],
            zoom: 7.34
        });
      },
      draw_clusters(json) {
        this.map.on('load', () => {
          const clusters_layer = this.map.addLayer({
            id: 'clusters_layer', 
            type: 'fill',
            layout: {},
            paint: {
              'fill-color': '#088',
              'fill-opacity': 0.2
            },
            source: {
              type: 'geojson',
              data: json
            }
          })

          const clusters_layer_highlighted = this.map.addLayer({
            id: 'clusters_layer_highlighted',
            type: 'fill',
            paint: {
              "fill-outline-color": "#484896",
              "fill-color": "#6e599f",
              "fill-opacity": 0.75
            },
            source: {
              type: 'geojson',
              data: json
            }
          })
          
          this.clusters_layer = clusters_layer

          const popup = new mapboxgl.Popup({
            closeButton: true
          })


          this.map.on('mousemove', e => {
            var features = this.map.queryRenderedFeatures(e.point, {
                layers: ['clusters_layer']
            });

            // Change the cursor style as a UI indicator.
            this.map.getCanvas().style.cursor = features.length ? 'pointer' : '';
          })

          this.map.on('click', (e) => {

            var features = this.map.queryRenderedFeatures(e.point, {
                layers: ['clusters_layer']
            });

            // Change the cursor style as a UI indicator.
            this.map.getCanvas().style.cursor = features.length ? 'pointer' : '';

            // Remove things if no feature was found.
            if (!features.length) {
                popup.remove();
                this.map.setFilter('clusters_layer_highlighted', ['!=', 'selected', 'true']);
                overlay.style.display = 'none';
                return;
            }

            // Single out the first found feature on mouseove.
            var feature = features[0];
            debugger
            feature.properties.selected = true

            this.map.setFilter('clusters_layer_highlighted', ['==', 'selected', 'true']);

            var title = document.createElement('strong');
            title.textContent = feature.properties.ClusterID + ' (' + feature.properties.NumStructures + ' structures)';


            // // Display a popup with the name of the cluster
            popup.setLngLat(e.lngLat)
                .setText(feature.properties.ClusterID)
                .addTo(this.map);
          })
          this.$store.commit('root:set_loading', false)
          
        });

      }
 
    }
  }
</script>

<style scoped>
  #map {
    min-height: calc(100vh - 250px);
    z-index: 0;
  }
</style>