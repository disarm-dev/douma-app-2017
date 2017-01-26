<template>
  <div class="tasks">
    <div class='md-title'>IRS Progress records</div>
    <div class="structures">
      <div>Count of loaded data/tasks/actions, etc: {{aCount}}</div>
    </div>

    <p>Please select an Area of Interest: </p>
    <p>(For now is REGION, but can will include Locality, Village, Tinkhundla)</p>
    <md-input-container>
      <label for="region">Region</label>
      <md-select name="region" v-model="region">
        <md-option value="hhohho">Hhohho</md-option>
        <md-option value="lubombo">Lubombo</md-option>
        <md-option value="manzini">Manzini</md-option>
        <md-option value="shiselweni">Shiselweni</md-option>
      </md-select>
    </md-input-container>
    <md-button @click='loadTasks'>Load tasks</md-button>
  </div>
</template>

<script>
  export default {
    name: 'IrsTasks',
    data() {
      return {
        aCount: 0,
        region: ''
      }
    },
    computed: {
    },
    methods: {
      loadTasks() {
        // Get user input
        // const aoi = this.region
        const aoi = 'lubombo'
        
        // Load everything you need
        const allEntities = require('../../../data_bootstrap/structures_5.json')
        const allActions = require('../../../data_bootstrap/actions.json')

        // Filter Entities for AOI
        const filteredEntities = allEntities.filter((entity) => {
          // TODO: @data Make sure structure/entities have `region` set
          return entity.properties.region == aoi
        })
        const filteredEntitiesOSMIDs = filteredEntities.map(entity => entity.properties.osm_id)

        // Find Actions that match filtered Entities
        const filteredActions = allActions.filter((action) => {
          return filteredEntitiesOSMIDs.includes(action.osm_id)
        })

        // Copy properties from filtered Actions to filtered Entities
        filteredActions.forEach((action) => {
          const matched_entity = filteredEntities.find(entity => entity.properties.osm_id === action.osm_id)

          if (matched_entity) {
            // TODO: @refac Could ignore unrequired properties in Object.assign below
            return Object.assign(matched_entity.properties, action) 
          }
        })

        // Store filtered Entities not in $store. Global anyone?
        this.$store.state.actions = filteredActions
        this.$store.state.activeAction = null
        window.douma = {data: {irs: {entities: filteredEntities}}} // TODO: @refac Don't use this global
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
