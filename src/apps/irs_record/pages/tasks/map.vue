<template>
  <div>
    <h1>TasksMap</h1>
    <div id='map'></div>
  </div>
</template>


<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  export default {
    name: 'TasksMap',
    props: ['cluster_id'],
    data() {
      return {
        map: {},
        tasks_layer: null,
        cluster_layer: null
      }
    },
    watch: {
      '$store.state.irs_record.tasks': 'draw_tasks',
    },
    mounted() {
      this.create_map()
      this.draw_clusters()
      this.draw_tasks()
    },
    methods: {
      create_map() {
        this.map = Leaflet.map('map', {
          tms: true,
          center: [-26.3231769,31.1380957],
          zoom: 10,
        });

        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        this.map.on('dblclick', (a,b,c) => {
          // console.log(a,b,c)
          this.$router.push({name: 'irs_record:clusters'})
        })

        Leaflet.tileLayer(url).addTo(this.map)
      },
      draw_clusters() {
        // Remove if exists
        if (this.cluster_layer) {
          this.map.removeLayer(this.cluster_layer)
          this.cluster_layer = null
        }

        const cluster = this.$store.state.irs_record.clusters.find(cluster => cluster._id === this.cluster_id)
        if (!cluster) return 

        // Create GeoJSON for Cluster

        this.cluster_layer = L.geoJSON(cluster.polygon, {
          style: (feature, layer) => {
            return { 
              fillColor: false,
              fillOpacity: 0,
              color: "lightblue",
              weight: 5,
              dashArray: "10, 10",
              clickable: false
            }
          }
        })
        this.map
          .addLayer(this.cluster_layer)
          .fitBounds(this.cluster_layer.getBounds())
      },
      draw_tasks() {
        // Remove if exists
        if (this.tasks_layer) {
          this.map.removeLayer(this.tasks_layer)
          this.tasks_layer = null
        }

        // Return unless there are spatial_entities to render
        if (this.$store.state.irs_record.tasks.length === 0) {
          return
        }

        // Create GeoJSON from search_results
        const tasks_geojson = this.$store.state.irs_record.tasks.map(task => {
          let SE = task.spatial_entity
          SE.properties.original_task = task
          return SE
        })

        this.tasks_layer = L.geoJSON(tasks_geojson, {
          style: (feature, layer) => {
            switch (feature.properties.original_task.properties.status) {
              case 'unvisited': 
                return { color: 'purple' }
              case 'visited_successful':
                return { color: 'green' }
              case 'visited_unsuccessful':
                return { color: 'red' }
            }
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              this.select_task(feature.properties.original_task)
            })
          }
        })

        this.map
          .addLayer(this.tasks_layer)
          // .fitBounds(this.tasks_layer.getBounds())
      },
      select_task(task) {
        this.$router.push({name: 'irs_record:task', params: {cluster_id: this.cluster_id, task_id: task._id}})
      }
    }
  }
</script>

<style scoped>
  #map {
    min-height: 85vh;
  }
</style>