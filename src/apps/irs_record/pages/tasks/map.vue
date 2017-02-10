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
        tasks_layer: null
      }
    },
    watch: {
      '$store.state.irs_record.tasks': 'draw_tasks',
    },
    mounted() {
      this.create_map()
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

        Leaflet.tileLayer(url).addTo(this.map)
      },
      draw_tasks() {
        console.log('draw')
        // Remove if exists
        if (this.tasks_layer) {
          console.log('removeLayer')
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
            if (feature.properties.original_task.properties.status === 'unvisited') {
                return { color: 'purple' }
            } else {
                return { color: 'green' }
            }
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              this.select_task(feature.properties.original_task)
            })
          }
        })

        console.log(this.tasks_layer)
        this.map
          .addLayer(this.tasks_layer)
          .fitBounds(this.tasks_layer.getBounds())
      },
      select_task(task) {
        console.log('do something with', task._id)
        // task.properties.status = 'something else'
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