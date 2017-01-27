<template>
  <div style='padding: 15px;'>{{allEntities}}</div>
  <!-- <pre style="font-family: Courier;background: #f4f4f4;border: solid 1px #e1e1e1;float: left;width: auto;">{{allEntities}}</pre> -->
</template>

<script>
  import turf from '@turf/turf'
  import IrsList from '../list/list.vue'
  import {BaseCollection} from '../../../lib/models.js'

  export default {
    name: 'IrsTasks',
    components: {'irs-list': IrsList},
    data() {
      return {
        spatialScale: '',
        region: '',
      }
    },
    computed: {
      allEntities() {
        const entities = require('../../../data_bootstrap/structures_orig.json')
        const geojson = entities.map((entity) => {
          let newEntity = Object.assign({}, {properties: entity})
          newEntity.geometry = newEntity.properties.geometry
          delete newEntity.properties.geometry
          return newEntity
        })

        const data = geojson//.slice(0,2)
                      return data
        // return JSON.stringify(data, null,' ')
      },
      tasksCount() {
        return this.$store.state.irs.tasks.length
      }
    },
    methods: {
      loadTasks() {
        // Get user input
        // const aoi = this.region
        const aoi = 'lubombo'
        
        // Load everything you need
        // TODO: @debug Actually need to load data, not just fake it
        const allEntities = require('../../../data_bootstrap/structures.json')
        const allActions = require('../../../data_bootstrap/actions.json')

        // Filter Entities for AOI
        const entitiesInAoi = allEntities.filter((entity) => {
          // TODO: @data Make sure structure/entities have `region` set
          return entity.properties.region == aoi
        })

        const entitiesInAoiOsmIds = entitiesInAoi.map(entity => entity.properties.osm_id)

        // Find Actions that match Entities in AOI
        const actionsInAoi = allActions.filter((action) => {
          return entitiesInAoiOsmIds.includes(action.osm_id)
        })

        // Build blank Actions for Entities without Actions
        const tasks = entitiesInAoi.map(entity => {
          const centroid = turf.centroid(entity.geometry)
          const relatedAction = actionsInAoi.find(action => action.osm_id === entity.properties.osm_id)

          if (relatedAction){
            relatedAction.centroid = centroid
            return relatedAction
          } else {
            return {
              osm_id: entity.properties.osm_id,
              actioned: 'unvisited',
              centroid: centroid
            }
          }
        })

        // Copy properties from Actions in AOI to Entities in AOI
        tasks.forEach((action) => {
          const matched_entity = entitiesInAoi.find(entity => entity.properties.osm_id === action.osm_id)

          if (matched_entity) {
            // TODO: @refac Could ignore unrequired properties in Object.assign below
            return Object.assign(matched_entity.properties, action) 
          }
        })

        // Store filtered Entities not in $store. Global anyone?
        this.$store.state.irs.tasks = tasks
        // TODO: @refac Can remove `Actions` from $store (check `sync.vue` first)
        // this.$store.state.irs.actions = actionsInAoi
        this.$store.state.irs.activeAction = null
        window.douma.data.irs.entities = entitiesInAoi
      }
    }
  }


</script>

<style scoped>
  .tasks {
    max-width: 800px;
    margin: 1em auto;
    padding: 1em;
  }
</style>
