<template>
  <div>
    <md-button class="md-primary" @click.native="upload">
      <md-icon>cloud_upload</md-icon> Upload
    </md-button>

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

      this.download_clusters()
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