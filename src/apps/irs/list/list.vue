<template>
  <div class="irs-list">
    <div class="md-title">Tasks ({{$store.state.irs.tasks.length}})</div>

    <div style='width: 100%; height: 20px; background: #cacaca'>
      <span style='background: green; height: 100%; display: block; float: left;'
        :style='{width: taskStat.visitedSuccess + "%"}'></span>
      <span style='background: red; height: 100%; display: block; float: left;'
        :style='{width: taskStat.visitedUnsuccess + "%"}'></span>
      <span style='background: orange; height: 100%; display: block; float: left;'
        :style='{width: taskStat.unvisited + "%"}'></span>
    </div>

    <md-chips v-model="searchOptions" md-input-placeholder="Add filter/search option">
      <template scope="chip">{{ chip.value }}</template>
    </md-chips>

    <md-input-container>
      <label>Search</label>
      <md-input v-model='searchTerm'>SEARCH</md-input>
    </md-input-container>

    <md-subheader>Not visited</md-subheader>
    <md-list class="md-dense">
      <md-list-item  
        v-for="task in unvisited" 
        @click="setActiveAction(task)" 
        :class="actionClass(task)">
        <md-icon>help</md-icon>
        <span>
          {{task.actioned}} ({{task.osm_id}})
        </span>
      </md-list-item>
    </md-list>

    <md-subheader>Visited</md-subheader>
    <md-list class="md-dense">
      <md-list-item  
        v-for="task in sortedTasks" 
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
  export default {
    name: 'IrsList',
    data() {
      return {
        searchOptions: [],
        searchTerm: ''
      }
    },
    computed: {
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
      }

    }
  }
</script>

<style>
  .irs-list {
    max-width: 800px;
    margin: 1em auto;
    padding: 1em;
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