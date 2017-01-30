<template>
  <div class="irs-list">
    <div class="md-title">Tasks ({{$store.state.irs.tasks.length}})</div>
    <!-- TODO: @debug Remove this "tasks reset" button -->
    <div>
      <md-button class='md-raised md-primary' @click='findClosestTask'>Find closest {{filterBy ? filterBy : 'all'}}</md-button>
      <md-button class='md-raised md-warn' @click='unloadTasks'>unLoad tasks</md-button>
    </div>

    <div style='width: 100%; height: 20px; background: #cacaca'>
      <span @click='addFilterBy("successfulVisit")' style='background: green; height: 100%; display: block; float: left;'
        :style='{width: taskStat.visitedSuccess + "%"}'></span>
      <span @click='addFilterBy("unsuccessfulVisit")' style='background: red; height: 100%; display: block; float: left;'
        :style='{width: taskStat.visitedUnsuccess + "%"}'></span>
      <span @click='addFilterBy("unvisited")' style='background: orange; height: 100%; display: block; float: left;'
        :style='{width: taskStat.unvisited + "%"}'></span>
    </div>

    <md-chips v-model="searchOptions" md-input-placeholder="Add filter/search option">
      <template scope="chip">{{ chip.value }}</template>
    </md-chips>

    <md-subheader>Unvisited ({{groupedFilteredTasks.unvisited.length}})</md-subheader>
    <md-list class="md-dense">
      <md-list-item  
        v-for="task in groupedFilteredTasks.unvisited" 
        @click="setActiveAction(task)" 
        :class="actionClass(task)">
        <md-icon>help</md-icon>
        <entity-entry :task='task'></entity-entry>
      </md-list-item>
    </md-list>

    <md-subheader>Visited unsuccessfully ({{groupedFilteredTasks.unsuccessfulVisit.length}})</md-subheader>
    <md-list class="md-dense">
      <md-list-item  
        v-for="task in groupedFilteredTasks.unsuccessfulVisit" 
        @click="setActiveAction(task)" 
        :class="actionClass(task)">
        <md-icon>{{task.actioned ? 'done'  : 'warning' }}</md-icon>
        <entity-entry :task='task'></entity-entry>
      </md-list-item>
    </md-list>

    <md-subheader>Visited successfully ({{groupedFilteredTasks.successfulVisit.length}})</md-subheader>
    <md-list class="md-dense">
      <md-list-item  
        v-for="task in groupedFilteredTasks.successfulVisit" 
        @click="setActiveAction(task)" 
        :class="actionClass(task)">
        <md-icon>{{task.actioned ? 'done'  : 'warning' }}</md-icon>
        <entity-entry :task='task'></entity-entry>
      </md-list-item>
    </md-list>

  </div>
</template>

<script>
  import EntityEntry from './entity-entry.vue'
  import turf from '@turf/turf'
  window.turf = turf

  export default {
    name: 'IrsList',
    components: {'entity-entry': EntityEntry},
    data() {
      return {
        searchOptions: [],
        searchTerm: '',
        filterBy: null,
        groupTypes: ['successfulVisit', 'unsuccessfulVisit', 'unvisited']
      }
    },
    computed: {
      tasksWithDistance() {
        if (this.userCoords) {
          return this.$store.state.irs.tasks.map((task) => {
            const distance = turf.distance(this.userCoords, task.centroid)
            task.distance = distance
            return task
          }).sort((a, b) => { 
            return a.distance - b.distance
          })
        } else {
          return this.$store.state.irs.tasks
        }

      },
      filteredTasks() {
        let tasks = this.tasksWithDistance

        if (this.filterBy) {
          tasks = tasks.filter((task) => task.actioned == this.filterBy)
        }

        return tasks
      },
      groupedFilteredTasks() {
        let groupedFilteredTasks = {}
        this.groupTypes.forEach( (groupType) => {
          groupedFilteredTasks[groupType] = this.filteredTasks.filter(task => task.actioned == groupType)          
        })
        return groupedFilteredTasks
      },
      taskStat() {
        const total = this.$store.state.irs.tasks.length
        const visitedSuccess = (this.groupedFilteredTasks.successfulVisit.length / total) * 100
        const visitedUnsuccess = (this.groupedFilteredTasks.unsuccessfulVisit.length / total) * 100

        return {
          visitedSuccess: visitedSuccess,
          visitedUnsuccess: visitedUnsuccess,
          unvisited: 100 - (visitedSuccess + visitedUnsuccess)
        }
      },
      userCoords() {
        const userCoordsMarker = window.douma.data.irs.userCoordsMarker
        if (!userCoordsMarker) return console.warn('For distance calculations, need to set location by clicking on map')
        return userCoordsMarker.toGeoJSON()
      }
    },
    methods: {
      addFilterBy(filterType) {
        if (this.filterBy === filterType) return this.filterBy = null 
        this.filterBy = filterType
      },
      setActiveAction(action) {
        this.$store.commit('irs:setActiveAction', action)
      },
      actionClass(task) {
        if (task.actioned == 'successfulVisit') {
          return 'actioned'
        } else if (task.actioned == 'unsuccessfulVisit') {
          return 'not-actioned'
        } else if (task.actioned == 'unvisited') {
          return 'unknown-action'
        }
      },
      findClosestTask() {
        if (!this.userCoords) return console.warn('Need to set location by clicking on map')

        const distanceArray = this.filteredTasks.map((task) => {
          const distance = turf.distance(this.userCoords, task.centroid, 'kilometers')
          return {
            task_id: task.id,
            osm_id: task.osm_id,
            distance: distance
          }
        })
        .sort((a, b) => {return a.distance > b.distance})
        
        const closest_osm_id = distanceArray[0].osm_id
        if (!closest_osm_id) return console.warn("Cannot find any nearby entity")
        
        this.$store.dispatch('irs:setActiveActionByOSMId', closest_osm_id)
      },
      unloadTasks() {
        // TODO: @debug Do we need the unloadTasks method at all, or is it just for debug?
        this.$store.commit("irs:reset")
        window.douma.data.irs.entities = []
        if (window.douma.data.irs.entitiesLayer) {
          window.douma.data.irs.entitiesLayer.remove()
          window.douma.data.irs.entitiesLayer = null
        }
      }
    }
  }
</script>

<style>
  .irs-list {
    max-width: 800px;
    /*margin: 1em auto;*/
    /*padding: 1em;*/
  }

  .actioned {
    color: green;
  }

  .not-actioned {
    color: red;
  }

  .unknown-action {
    color: orange;
  }
</style>