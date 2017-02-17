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
      this.$store.dispatch('irs_tasker:configure_sync', this.$store.state.meta.team_id)
      this.$store.dispatch("irs_tasker:set_clusters_from_local")
    },
    methods: {
      download_clusters() {
        this.$store.dispatch("irs_tasker:download_clusters")
      },
      clear() {
        this.$store.dispatch("irs_tasker:clear_clusters")
      },
      upload() {
        // TODO: @feature upload
      }
    }
  }
</script>