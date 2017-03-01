<template>
  <div>
  <!--   <md-button class="md-primary" @click.native="upload">
      <md-icon>cloud_upload</md-icon> Upload
    </md-button> -->

    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'TaskerView',
    mounted() {
      this.$store.dispatch("irs_tasker:get_clusters", {demo_instance_id: this.$store.state.meta.demo_instance_id})
    },
    methods: {
      upload() {
        this.$store.dispatch("irs_tasker:update_clusters_with_spray_teams")
      }
    }
  }
</script>