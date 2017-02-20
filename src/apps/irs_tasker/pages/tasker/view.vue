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

      <md-button class="md-fab md-primary md-mini md-clean" @click.native="upload">
        <md-icon>cloud_upload</md-icon>
      </md-button>

    </md-speed-dial>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'TaskerView',
    mounted() {
      console.log('set_clusters_from_local')
      this.$store.dispatch('irs_tasker:configure_sync', this.$store.state.meta.demo_instance_id)
      this.$store.dispatch("irs_tasker:set_clusters_from_local")
    },
    methods: {
      download_clusters() {
        this.$store.dispatch("irs_tasker:download_clusters")
      },
      upload() {
        this.$store.dispatch("irs_tasker:update_clusters_with_spray_teams").then(() => {
          // Do a snackbar
        })
      }
    }
  }
</script>