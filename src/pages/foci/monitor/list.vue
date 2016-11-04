<template>
  <div class="monitor-list">
    <md-card class="foci-card">
      <md-card-header>
        <div class="md-title">Foci in Lobamba</div>
      </md-card-header>
      <md-card-content>
        <md-list class="md-double-line">
          <md-list-item>
            <md-icon class="md-primary">blur_on</md-icon>

            <div class="md-list-text-container">
              <span>Foci #1</span>
              <span>Nhlangano</span>
            </div>

            <md-button class="md-accent">Read more</md-button>
          </md-list-item>

          <md-list-item>
            <md-icon class="md-primary">blur_on</md-icon>

            <div class="md-list-text-container">
              <span>Foci #2</span>
              <span>Mbabane</span>
            </div>

            <md-button class="md-accent">Read more</md-button>
          </md-list-item>

          <md-list-item>
            <md-icon class="md-primary">blur_on</md-icon>

            <div class="md-list-text-container">
              <span>Foci #3</span>
              <span>Ezulwini</span>
            </div>

            <md-button class="md-accent">Read more</md-button>
          </md-list-item>
        </md-list>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style scoped>
  .monitor-list {
    margin: 2em 1em;
  }

  .foci-card {
    max-width: 800px;
    margin: 0 auto;
  }

</style>