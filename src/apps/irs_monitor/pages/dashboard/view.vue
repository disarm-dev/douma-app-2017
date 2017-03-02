<template>
  <div>
    <h1 class="md-display-1" style="padding: 0 1em;">IRS Monitor</h1>
    <div class="boxes">

      <div v-if='!data_loaded'>
        <div class='md-headline'>Loading data...</div>
      </div>

      <template v-if='data_loaded && only_zeroes_returned'>
        <div class='md-headline'>No data found - have you created any Clusters yet?</div>
      </template>

      <template v-if='data_loaded && !only_zeroes_returned'>

        <div class="box">
          <md-card>
            
            <p class="big-number">{{round(((structuresUnsuccessfullyVisited + structuresSuccessfullyVisited) / tasks_total) * 100)}} %</p>

            <md-card-header>
              <!-- TODO: @debug Replace with real numbers -->
              <div class="md-title">n of n structures visited</div>
              <div class="md-subhead">in Swaziland</div>
            </md-card-header>

          </md-card>
        </div>

        <div class="box">
          <md-card>
            
            <p class="big-number">{{round((structuresSuccessfullyVisited / tasks_total) * 100)}} %</p>

            <md-card-header>
              <div class="md-title">Structures successfully visited</div>
              <div class="md-subhead">in Swaziland</div>
            </md-card-header>

          </md-card>
        </div>

        <div class="box">
          <md-card>
            
            <p class="big-number">{{round((structuresUnsuccessfullyVisited / tasks_total) * 100)}} %</p>

            <md-card-header>
              <div class="md-title">Structures unsuccessfully visited</div>
              <div class="md-subhead">in Swaziland</div>
            </md-card-header>

          </md-card>
        </div>

        <div class="box">
          <md-card>
            
            <p class="big-number">{{clusters_total}}</p>

            <md-card-header>
              <div class="md-title">Clusters </div>
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
    mounted() {
      this.$store.dispatch('irs_monitor:set_demo_instance_id', this.$store.state.meta.demo_instance_id)
      this.$store.dispatch('irs_monitor:get_monitor_data').then(() => this.data_loaded = true)
    },
    data() {
      return {
        data_loaded: false
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
      tasks_total() {
        return this.$store.state.irs_monitor.taskCounts.total
      },
      clusters_total() {
        return this.$store.state.irs_monitor.clusterCount
      },
      only_zeroes_returned() {
        return ((this.$store.state.irs_monitor.taskCounts.total === 0) && (this.$store.state.irs_monitor.clusterCount === 0))
      }
    },
    methods:{
      round(num) {
        return parseFloat(Math.round(num * 100) / 100).toFixed(2);
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