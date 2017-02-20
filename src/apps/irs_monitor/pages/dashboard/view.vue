<template>
  <div>
    <h1 class="md-display-1" style="padding: 0 1em;">IRS Monitor</h1>
    <div class="boxes">

      <div class="box" v-if="tasks === 0">
        <md-card :md-theme="'default'" class="md-primary">

          <md-card-header>
            <div class="md-title">No structures</div>
          </md-card-header>

        </md-card>
      </div>

      <template v-else>
      <div class="box">
        <md-card :md-theme="'default'" class="md-primary">
          
          <p class="big-number">{{round(((structuresUnsuccessfullyVisited + structuresSuccessfullyVisited) / tasks) * 100)}} %</p>

          <md-card-header>
            <div class="md-title">Structures visited</div>
            <div class="md-subhead">in Swaziland</div>
          </md-card-header>

        </md-card>
      </div>

      <div class="box">
        <md-card :md-theme="'foci'" class="md-primary">
          
          <p class="big-number">{{round((structuresSuccessfullyVisited / tasks) * 100)}} %</p>

          <md-card-header>
            <div class="md-title">Structures successfully visited</div>
            <div class="md-subhead">in Swaziland</div>
          </md-card-header>

        </md-card>
      </div>

      <div class="box">
        <md-card :md-theme="'meta'" class="md-primary">
          
          <p class="big-number">{{round((structuresUnsuccessfullyVisited / tasks) * 100)}} %</p>

          <md-card-header>
            <div class="md-title">Structures unsuccessfully visited</div>
            <div class="md-subhead">in Swaziland</div>
          </md-card-header>

        </md-card>
      </div>
      </template>
      
    </div>

  </div>
</template>

<script>
  export default {
    name: 'DashboardView',
    data() {
      return {
        stuff: ["default", "foci", "irs_monitor", "irs_plan", "irs_record", "irs_tasker", "cases", "meta"]
      }
    },
    methods:{
      round(num) {
        return parseFloat(Math.round(num * 100) / 100).toFixed(2);
      } 
    },
    computed: {
      structuresSuccessfullyVisited() {
        let count = this.$store.state.irs_monitor.tasks.filter((task) => {
          if (!task.properties) return false
          return task.properties.status === 'visited_successful'
        })

        return count ? count.length : 0
      },
      structuresUnsuccessfullyVisited() {
        let count = this.$store.state.irs_monitor.tasks.filter((task) => {
          if (!task.properties) return false
          return task.properties.status === 'visited_unsuccessful'
        })

        return count ? count.length : 0
      },
      structuresUnvisited() {
        let count = this.$store.state.irs_monitor.tasks.filter((task) => {
          if (!task.properties) return false
          return task.properties.status === 'unvisited'
        })
        return count ? count.length : 0
      },

      clusters() {
        let clusters = this.$store.state.irs_monitor.clusters
        return clusters ? clusters.length : 'Loading...'
      },
      tasks() {
        let tasks = this.$store.state.irs_monitor.tasks
        return tasks ? tasks.length : 0
      }
    }
  }
</script>

<style>
  .boxes {
    display: flex;
    flex-wrap: wrap; 
    margin: 1em;
  }

  .box {
    flex: 1;
    flex-basis: 100%;
  }

  .box > * {
    margin: 1em;
  }

  @media (min-width: 700px) {
    .box {
      flex-basis: 50%;
    }
  }

  @media (min-width: 1000px) {
    .box {
      flex-basis: 33.33%;
    }
  }

  .big-number {
    font-size: 3em;
    text-align: center;
  }
</style>