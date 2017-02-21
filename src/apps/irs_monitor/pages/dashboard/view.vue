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
            <!-- TODO: @debug Replace with real numbers -->
            <div class="md-title">200 of 20000 structures visited</div>
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
    mounted() {
      this.$store.dispatch('irs_monitor:get_tasks_count')
      this.$store.dispatch('irs_monitor:get_tasks_unvisited')
      this.$store.dispatch('irs_monitor:get_tasks_successful')
      this.$store.dispatch('irs_monitor:get_tasks_unsuccessful')
    },
    methods:{
      round(num) {
        return parseFloat(Math.round(num * 100) / 100).toFixed(2);
      } 
    },
    computed: {
      structuresSuccessfullyVisited() {
        return this.$store.state.irs_monitor.taskCounts.visited_successful
      },
      structuresUnsuccessfullyVisited() {
        return this.$store.state.irs_monitor.taskCounts.visited_unsuccessful
      },
      structuresUnvisited() {
        return this.$store.state.irs_monitor.taskCounts.unvisited
      },
      tasks() {
        return this.$store.state.irs_monitor.taskCounts.total
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