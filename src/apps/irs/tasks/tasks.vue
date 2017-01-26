<template>
  <div class="tasks">
    <div class='md-title'>IRS Progress records</div>
    <div class="structures">
      <div>Tasks count: {{tasksCount}}</div>
    </div>

    <p>Please select a Scale and then an Area of Interest: </p>

    <md-input-container>
      <label for="spatialScale">Spatial scale</label>
      <md-select name="spatialScale" v-model="spatialScale">
        <md-option value="Region">Region</md-option>
        <md-option value="Locality">Locality</md-option>
        <md-option value="Inkhundla">Inkhundla</md-option>
        <md-option value="Village">Village</md-option>
        <md-option value="Cluster">Cluster</md-option>
        <md-option value="Homestead">Homestead</md-option>
        <md-option value="Household">Household</md-option>
        <md-option value="Structure">Structure</md-option>
        <md-option value="Room">Room</md-option>
      </md-select>
    </md-input-container>
    <md-input-container>
      <label for="region">Region</label>
      <md-select name="region" v-model="region">
        <md-option value="hhohho">Hhohho</md-option>
        <md-option value="lubombo">Lubombo</md-option>
        <md-option value="manzini">Manzini</md-option>
        <md-option value="shiselweni">Shiselweni</md-option>
      </md-select>
    </md-input-container>

    <div>
      <md-button @click='loadTasks'>Load tasks</md-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'IrsTasks',
    data() {
      return {
        spatialScale: '',
        region: ''
      }
    },
    computed: {
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
        const allEntities = require('../../../data_bootstrap/structures_5.json')
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
          const relatedAction = actionsInAoi.find(action => action.osm_id === entity.properties.osm_id)
          console.log(relatedAction)
          if (relatedAction){
            return relatedAction;
          } else {
            return {
              osm_id: entity.properties.osm_id,
              actioned: 'unvisited'
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
  .structures {
    padding: 1em;
  }
</style>
