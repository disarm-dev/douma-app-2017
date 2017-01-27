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
        <span>
          {{task.actioned}} ({{task.osm_id}})
        </span>
      </md-list-item>
    </md-list>

    <md-subheader>Visited unsuccessfully ({{groupedFilteredTasks.unsuccessfulVisit.length}})</md-subheader>
    <md-list class="md-dense">
      <md-list-item  
        v-for="task in groupedFilteredTasks.unsuccessfulVisit" 
        @click="setActiveAction(task)" 
        :class="actionClass(task)">
        <md-icon>{{task.actioned ? 'done'  : 'warning' }}</md-icon>
        <span>
          {{task.actioned}} ({{task.osm_id}})
        </span>
      </md-list-item>
    </md-list>

    <md-subheader>Visited successfully ({{groupedFilteredTasks.successfulVisit.length}})</md-subheader>
    <md-list class="md-dense">
      <md-list-item  
        v-for="task in groupedFilteredTasks.successfulVisit" 
        @click="setActiveAction(task)" 
        :class="actionClass(task)">
        <md-icon>{{task.actioned ? 'done'  : 'warning' }}</md-icon>
        <span>
          {{task.actioned}} ({{task.osm_id}})
        </span>
      </md-list-item>
    </md-list>

  </div>
</template>

<script>
  import turf from 'turf'
  window.turf = turf

  export default {
    name: 'IrsList',
    data() {
      return {
        searchOptions: [],
        searchTerm: '',
        filterBy: null,
        groupTypes: ['successfulVisit', 'unsuccessfulVisit', 'unvisited']
      }
    },
    computed: {
      filteredTasks() {
        let tasks = this.$store.state.irs.tasks

        if (this.filterBy) {
          tasks = tasks.filter((task) => {
            return task.actioned == this.filterBy
          })
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
      sortedTasks(){
        return this.$store.state.irs.tasks
          .filter(task => task.actioned !== 'unvisited')
          .sort( (a, b) => a.actioned > b.actioned)
      },
      visitedSuccess() {
        return this.$store.state.irs.tasks.filter(task => task.actioned == 'successfulVisit')
      },
      visitedUnsuccess() {
        return this.$store.state.irs.tasks.filter(task => task.actioned == 'unsuccessfulVisit')
      },
      unvisited() {
        return this.$store.state.irs.tasks.filter(task => task.actioned == 'unvisited')
      },
      taskStat() {
        const total = this.$store.state.irs.tasks.length
        const visitedSuccess = (this.visitedSuccess.length / total) * 100
        const visitedUnsuccess = (this.visitedUnsuccess.length / total) * 100


        return {
          visitedSuccess: visitedSuccess,
          visitedUnsuccess: visitedUnsuccess,
          unvisited: 100 - (visitedSuccess + visitedUnsuccess)
        }
      }
    },
    methods: {
      addFilterBy(filterType) {
        if (this.filterBy === filterType) return this.filterBy = null 
        this.filterBy = filterType
      },
      setActiveAction(action) {
        this.$store.commit('irs:setActiveAction', action)
        this.$router.push({name: 'irs:form'})
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
        const userCoordsMarker = window.douma.data.irs.userCoordsMarker
        if (!window.douma.data.irs.userCoordsMarker) return console.warn('Need to set location by clicking on map')

        const userCoords = window.douma.data.irs.userCoordsMarker.toGeoJSON()

        // Get all the entities
        const distanceArray = this.filteredTasks.map((task) => {
          const distance = turf.distance(userCoords, task.centroid, 'kilometers')
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
        this.$router.push({name: "irs:form"})
      },
      unloadTasks() {
        // TODO: @debug Remove these temporary things
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