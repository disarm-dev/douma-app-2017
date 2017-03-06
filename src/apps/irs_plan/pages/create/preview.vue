<template>
  <div>
    <div class="container">
      <h1>Clustering preview</h1>
      <p>Are you happy with these Clusters?</p>
      <md-button class='md-primary md-raised' @click.native="post_clusters">YES (save)</md-button>
      <md-button class='md-warn' @click.native="$router.push({name: 'irs_plan:create:select_ous'})">NO (start again)</md-button>
    </div>
    <div id='map'></div>
    <div id='map-overlay'></div>
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
          });
          this.clusters_layer = clusters_layer
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
              this.map.setFilter('clusters_layer_highlighted', ['in', 'COUNTY', '']);
              overlay.style.display = 'none';
              return;
          }

          // Single out the first found feature on mouseove.
          var feature = features[0];

          // Query the counties layer visible in the map. Use the filter
          // param to only collect results that share the same county name.
          var relatedFeatures = this.map.querySourceFeatures('counties', {
              sourceLayer: 'original',
              filter: ['in', 'COUNTY', feature.properties.COUNTY]
          });

          // Render found features in an overlay.
          overlay.innerHTML = '';

          // Total the population of all features
          var populationSum = relatedFeatures.reduce(function(memo, feature) {
              return memo + feature.properties.population;
          }, 0);

          var title = document.createElement('strong');
          title.textContent = feature.properties.COUNTY + ' (' + relatedFeatures.length + ' found)';

          var population = document.createElement('div');
          population.textContent = 'Total population: ' + populationSum.toLocaleString();

          overlay.appendChild(title);
          overlay.appendChild(population);
          overlay.style.display = 'block';

          // Display a popup with the name of the county
          popup.setLngLat(e.lngLat)
              .setText(feature.properties.COUNTY)
              .addTo(this.map);
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
  
  .map-overlay {
      font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
      background-color: #fff;
      box-shadow: 0 1px 2px rgba(0,0,0,0.10);
      border-radius: 3px;
      position: absolute;
      width: 25%;
      top: 10px;
      left: 10px;
      padding: 10px;
      display: none;
  }
</style>