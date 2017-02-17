<template>
  <div>
    <h1 class="md-display-1" style="padding: 0 1em;">IRS Monitor</h1>
    <div class="boxes">
      
    
      <div class="box">
        <md-card :md-theme="'default'" class="md-primary">
          
          <p class="big-number">58</p>

          <md-card-header>
            <div class="md-title">Number of clusters</div>
            <div class="md-subhead">in Swaziland</div>
          </md-card-header>

          <md-card-actions>
            <md-button>Cool</md-button>
          </md-card-actions>

        </md-card>
      </div>

      <div class="box">
        <md-card md-theme="foci" class="md-primary">
          
          <p class="big-number">1625</p>

          <md-card-header>
            <div class="md-title">Number of tasks</div>
            <div class="md-subhead">in Swaziland</div>
          </md-card-header>

          <md-card-actions>
            <md-button>Awesome</md-button>
          </md-card-actions>

        </md-card>
      </div>

      <div class="box">
        <md-card md-theme="meta" class="md-primary">
          
          <p class="big-number">594361</p>

          <md-card-header>
            <div class="md-title">Number of structures</div>
            <div class="md-subhead">in Swaziland</div>
          </md-card-header>

          <md-card-actions>
            <md-button>Great</md-button>
          </md-card-actions>

        </md-card>
      </div>

      
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