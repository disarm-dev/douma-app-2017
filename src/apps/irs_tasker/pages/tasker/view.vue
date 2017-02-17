<template>
  <div>
    <md-speed-dial style='z-index: 10000' md-open="click" md-direction="bottom" class="md-fab-top-right">
    
      <md-button class="md-fab" md-fab-trigger>
        <md-icon md-icon-morph>close</md-icon>
        <md-icon>menu</md-icon>
      </md-button>

      <md-button class="md-fab md-primary md-mini md-clean" @click.native='download_clusters'>
        <md-icon>file_download</md-icon>
      </md-button>

      <md-button class="md-fab md-primary md-mini md-clean" @click.native="navigate('edit')">
        <md-icon>mode_edit</md-icon>
      </md-button>

    </md-speed-dial>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'TaskerView',
    methods: {
      download_clusters() {
        // console.log('download_clusters')
        this.$store.dispatch("irs_tasker:download_clusters")
      }
    }
  }
</script>